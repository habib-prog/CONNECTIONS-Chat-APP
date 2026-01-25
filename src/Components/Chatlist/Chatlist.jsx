import React, { useEffect, useState } from "react";
import "./Chatlist.css";
import Adduser from "../Adduser/Adduser";
import { useUserStore } from "../../ZustandStore/useUserStore";
import { useChatStore } from "../../ZustandStore/useChatStore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../Database";

const Chatlist = () => {
  const [addMode, setaddMode] = useState(false);
  const [chats, setChats] = useState([]);

  const { currentuser } = useUserStore();
  const { setChat } = useChatStore();

  useEffect(() => {
    if (!currentuser?.id) return;

    const unSub = onSnapshot(
      doc(db, "userschats", currentuser.id),
      async (res) => {
        const data = res.data();
        if (!data) return;

        const items = data.chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          // last message logic
          const lastMsg = item.lastMessage || "";

          return {
            ...item,
            user: { ...user, id: item.receiverId },
            lastMessage: lastMsg,
          };
        });

        const chatData = await Promise.all(promises);

        // Sort by updatedAt (recent first)
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      },
    );

    return () => unSub();
  }, [currentuser.id]);

  const handleSelected = (chat) => {
    setChat(chat.chatId, chat.user);
  };

  return (
    <div className="Chatlist">
      <div className="search">
        <div className="searchbar">
          <img className="searchIcon" src="/search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          className="add"
          src={addMode ? "/public/minus.png" : "/add.png"}
          alt=""
          onClick={() => setaddMode((prev) => !prev)}
        />
      </div>

      {chats.map((chat) => (
        <div
          className="items"
          key={chat.chatId}
          onClick={() => handleSelected(chat)}
        >
          <img
            className="userList"
            src={chat.user?.avatar || "/public/woman.png"}
            alt=""
          />
          <div className="texts">
            <span className="username">{chat.user?.username || "User"}</span>
            <p className="lastMsg">
              {chat.lastMessage
                ? chat.lastMessage.split(" ").slice(0, 3).join(" ") +
                  (chat.lastMessage.split(" ").length > 3 ? "..." : "")
                : "No messages yet"}
            </p>
          </div>
        </div>
      ))}

      {addMode && <Adduser />}
    </div>
  );
};

export default Chatlist;
