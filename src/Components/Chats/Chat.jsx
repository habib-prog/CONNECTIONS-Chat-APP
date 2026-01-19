import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../Database";
import { useUserStore } from "../../ZustandStore/useUserStore";
import { useChatStore } from "../../ZustandStore/useChatStore";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  // DNT (Do Not Type) and Typing States
  const [dntActive, setDntActive] = useState(false);
  const [dntOwnerId, setDntOwnerId] = useState(null);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const endRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { currentuser } = useUserStore();
  const { chatId, chatUser } = useChatStore();

  // Logic: Amr input ki lock thakbe?
  const isInputLocked = dntActive && dntOwnerId !== currentuser.id;

  // ================= EMOJI LOGIC =================
  const addEmoji = (emojiData) => {
    if (isInputLocked) return;
    setText((prev) => prev + emojiData.emoji);
    setOpen(false);
  };

  // ================= REALTIME SYNC =================
  useEffect(() => {
    if (!chatId) return;

    const chatRef = doc(db, "chats", chatId);

    const unsub = onSnapshot(chatRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();

      setMessages(data.messages || []);

      // 1. DNT Status Sync Ke DNT on kose seta check kora
      if (data.dntStatus?.active) {
        setDntActive(true);
        setDntOwnerId(data.dntStatus.ownerId);
      } else {
        setDntActive(false);
        setDntOwnerId(null);
      }

      // 2. Typing Indicator Sync
      if (
        data.typingStatus?.isTyping &&
        data.typingStatus?.typerId !== currentuser.id
      ) {
        setIsOtherTyping(true);
      } else {
        setIsOtherTyping(false);
      }
    });

    return () => unsub();
  }, [chatId, currentuser.id]);

  // ================= TYPING HANDLER =================
  const updateTypingStatus = async (typing) => {
    if (!chatId || isInputLocked) return;
    await updateDoc(doc(db, "chats", chatId), {
      "typingStatus.isTyping": typing,
      "typingStatus.typerId": typing ? currentuser.id : null,
    });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (val.length > 0) {
      updateTypingStatus(true);
      // 3 second por typing indicator auto off hobe
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(false);
      }, 3000);
    } else {
      updateTypingStatus(false);
    }
  };

  // ================= TOGGLE DNT (MANUAL) =================
  const toggleDNT = async () => {
    if (!chatId) return;
    // Jodi onno keu agei DNT on kore thake, tahole ami kichu korte parbo na
    if (dntActive && dntOwnerId !== currentuser.id) return;

    const newState = !dntActive;
    await updateDoc(doc(db, "chats", chatId), {
      dntStatus: {
        active: newState,
        ownerId: newState ? currentuser.id : null,
      },
      "typingStatus.isTyping": false, // DNT toggle korle typing reset
    });
  };

  // ================= AUTO SCROLL =================
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!text.trim() || !chatId || isInputLocked) return;

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        senderId: currentuser.id,
        text,
        createdAt: Timestamp.now(),
        status: "sent",
      }),
      "typingStatus.isTyping": false, // Send korle typing off hobe
    });

    setText("");
  };

  return (
    <div className="chats">
      {/* ========== TOP ========== */}
      <div className="top">
        <div className="userinformation">
          <img
            className="avatar"
            src={chatUser?.avatar || "/public/avatar.png"}
            alt="avatar"
          />
          <div className="text">
            <span className="uname">{chatUser?.username || "Chat"}</span>
            <p className="udes">
              {isOtherTyping ? (
                <b style={{ color: "#5183fe" }}>Typing...</b>
              ) : dntActive ? (
                <span style={{ color: "#ff4d4d", fontSize: "12px" }}>
                  {dntOwnerId === currentuser.id
                    ? "DNT Mode: Your Turn"
                    : `${chatUser?.username} is typing...`}
                </span>
              ) : (
                "Active now"
              )}
            </p>
          </div>
        </div>

        <div
          className="icons"
          style={{ display: "flex", alignItems: "center" }}
        >
          {/*  DNT  BUTTON */}
          <button
            onClick={toggleDNT}
            disabled={dntActive && dntOwnerId !== currentuser.id}
            style={{
              padding: "5px 12px",
              borderRadius: "5px",
              border: "none",
              cursor:
                dntActive && dntOwnerId !== currentuser.id
                  ? "not-allowed"
                  : "pointer",
              backgroundColor: dntActive
                ? dntOwnerId === currentuser.id
                  ? "#ff4d4d"
                  : "#444"
                : "#4caf50",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            {dntActive
              ? dntOwnerId === currentuser.id
                ? "STOP DNT"
                : "LOCKED"
              : "START DNT"}
          </button>

          <img className="iconsize" src="/public/phone-call.png" alt="" />
          <img className="iconsize" src="/public/video (1).png" alt="" />
          <img className="iconsize" src="/public/info.png" alt="" />
        </div>
      </div>

      {/* ========== CENTER ========== */}
      <div className="center">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${msg.senderId === currentuser.id ? "own" : ""}`}
          >
            <div className="texts">
              <p className="content">{msg.text}</p>
              <span className="time">
                {msg.createdAt?.toDate().toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* ========== BOTTOM ========== */}
      <div className="bottom">
        <div className="icons">
          <img className="iconsize" src="/public/image-.png" alt="" />
          <img className="iconsize" src="/public/camera.png" alt="" />
          <img className="iconsize" src="/public/mic.png" alt="" />
        </div>

        <input
          type="text"
          placeholder={
            isInputLocked
              ? `Wait for ${chatUser?.username}...`
              : "Write message..."
          }
          value={text}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isInputLocked}
          style={{
            cursor: isInputLocked ? "not-allowed" : "text",
            opacity: isInputLocked ? 0.6 : 1,
          }}
        />

        <div className="emoji">
          <img
            className="iconsize"
            src="/public/emoji.png"
            alt=""
            onClick={() => !isInputLocked && setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker open={open} onEmojiClick={addEmoji} />
            </div>
          )}
        </div>

        <div
          className="sendbtn"
          onClick={handleSend}
          style={{
            opacity: isInputLocked || !text.trim() ? 0.5 : 1,
            cursor: isInputLocked || !text.trim() ? "not-allowed" : "pointer",
          }}
        >
          Send
        </div>
      </div>
    </div>
  );
};

export default Chat;
