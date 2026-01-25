import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  getDoc,
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

  // Image states
  const [img, setImg] = useState({ file: null, url: "" });
  const [uploading, setUploading] = useState(false);

  const [dntActive, setDntActive] = useState(false);
  const [dntOwnerId, setDntOwnerId] = useState(null);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const endRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { currentuser } = useUserStore();
  const { chatId, chatUser, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const isInputLocked =
    (dntActive && dntOwnerId !== currentuser.id) ||
    isCurrentUserBlocked ||
    isReceiverBlocked;

  // ================= CLOUDINARY UPLOAD =================
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Chat_app");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlgwrts8q/image/upload",
      { method: "POST", body: formData },
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // ================= EMOJI LOGIC =================
  const addEmoji = (emojiData) => {
    if (isInputLocked) return;
    setText((prev) => prev + emojiData.emoji);
    setOpen(false);
  };

  // ================= REAL-TIME SYNC start =================
  useEffect(() => {
    if (!chatId) return;
    const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
      const data = res.data();
      if (data) {
        setMessages(data.messages || []);
        setDntActive(data.dntStatus?.active || false);
        setDntOwnerId(data.dntStatus?.ownerId || null);
        setIsOtherTyping(
          data.typingStatus?.isTyping &&
            data.typingStatus?.typerId !== currentuser.id,
        );
      }
    });
    return () => unsub();
  }, [chatId, currentuser.id]);

  // ================= REAL-TIME SYNC start =================

  // ================= TYPING HANDLER start =================
  const updateTypingStatus = async (typing) => {
    if (!chatId || isInputLocked) return;
    await updateDoc(doc(db, "chats", chatId), {
      "typingStatus.isTyping": typing,
      "typingStatus.typerId": typing ? currentuser.id : null,
    });
  };

  // ================= TYPING HANDLER end =================

  const handleInputChange = (e) => {
    setText(e.target.value);
    updateTypingStatus(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => updateTypingStatus(false),
      3000,
    );
  };

  // ================= TOGGLE DNT =================
  const toggleDNT = async () => {
    if (!chatId || (dntActive && dntOwnerId !== currentuser.id)) return;
    const newState = !dntActive;
    await updateDoc(doc(db, "chats", chatId), {
      dntStatus: {
        active: newState,
        ownerId: newState ? currentuser.id : null,
      },
      "typingStatus.isTyping": false,
    });
  };

  // ================= AUTO SCROLL =================
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, img.url]);

  // ================= SEND MESSAGE =================

  const handleSend = async () => {
    if ((!text.trim() && !img.file) || !chatId || isInputLocked) return;

    try {
      setUploading(true);
      let imgUrl = null;

      if (img.file) {
        imgUrl = await uploadToCloudinary(img.file);
      }

      const messageContent = text.trim() || (imgUrl ? "Sent an image" : "");

      // 1. Messages update kora
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentuser.id,
          text: text.trim(),
          createdAt: Timestamp.now(),
          ...(imgUrl && { image: imgUrl }),
        }),
        "typingStatus.isTyping": false,
      });

      // 2. Chatlist (userschats) update kora - jate preview r sorting thik thake
      const userIDs = [currentuser.id, chatUser.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userschats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId,
          );

          // Last message update logic
          userChatsData.chats[chatIndex].lastMessage = messageContent;
          userChatsData.chats[chatIndex].isSeen =
            id === currentuser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now(); // Sort korar jonno time

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });

      setText("");
      setImg({ file: null, url: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="chats">
      {/* ========== TOP ========== */}
      <div className="top">
        <div className="userinformation">
          <img
            className="avatar"
            src={chatUser?.avatar || "/avatar.png"}
            alt="avatar"
          />
          <div className="text">
            <span className="uname">{chatUser?.username || "Chat"}</span>
            <p className="udes">
              {isOtherTyping ? (
                <b style={{ color: "#5ffe51" }}>Typing...</b>
              ) : dntActive ? (
                <span
                  style={{
                    color: "#ff4d4d",
                    fontWeight: "bolder",
                    fontSize: "15px",
                  }}
                >
                  {dntOwnerId === currentuser.id
                    ? "DNT - You Are In Control..."
                    : "DNT Can't type while reciever is typing.."}
                </span>
              ) : (
                "Active now"
              )}
            </p>
          </div>
        </div>

        <div className="icons">
          <button
            onClick={toggleDNT}
            className={`dnt-btn ${dntActive ? "active" : ""}`}
            disabled={dntActive && dntOwnerId !== currentuser.id}
          >
            {dntActive
              ? dntOwnerId === currentuser.id
                ? "STOP DNT"
                : "LOCKED"
              : "START DNT"}
          </button>
          <img className="iconsize" src="/info.png" alt="" />
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
              {msg.image && <img src={msg.image} alt="" className="msg-img" />}
              {msg.text && <p className="content">{msg.text}</p>}
              <span className="time">
                {msg.createdAt?.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* ========== BOTTOM ========== */}
      <div className="bottom">
        {img.url && (
          <div className="img-preview-box">
            <img src={img.url} alt="preview" />
            <div
              className="delete-img"
              onClick={() => setImg({ file: null, url: "" })}
            >
              X
            </div>
          </div>
        )}

        <div className="bottom-content">
          <div className="icons">
            <label htmlFor="file">
              <img
                className="iconsize"
                src="/image-.png"
                alt=""
                style={{ opacity: isInputLocked ? 0.4 : 1 }}
              />
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleImg}
              disabled={isInputLocked}
            />
          </div>

          <input
            type="text"
            placeholder={
              isInputLocked
                ? `Locked by ${chatUser?.username}...`
                : "Write message..."
            }
            value={text}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isInputLocked}
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
                <EmojiPicker onEmojiClick={addEmoji} />
              </div>
            )}
          </div>

          <div
            className="sendbtn"
            onClick={handleSend}
            style={{
              opacity:
                isInputLocked || (!text.trim() && !img.file) || uploading
                  ? 0.5
                  : 1,
            }}
          >
            {uploading ? "..." : "Send"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
