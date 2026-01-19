import React, { useEffect, useState } from "react";
import "./Details.css";
import { auth, db } from "../../Database";
import { useUserStore } from "../../ZustandStore/useUserStore";
import { useChatStore } from "../../ZustandStore/useChatStore";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const Details = () => {
  const { currentuser } = useUserStore();
  const {
    chatId,
    chatUser,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
  } = useChatStore();

  const [sharedPhotos, setSharedPhotos] = useState([]);
  const [isOpen, setIsOpen] = useState(true); // Toggle logic-er jonno state

  // Shared photos dynamic fetch
  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      if (res.exists()) {
        const data = res.data();
        const images = data.messages
          .filter((m) => m.image)
          .map((m) => ({
            url: m.image,
            createdAt: m.createdAt,
          }))
          .sort((a, b) => b.createdAt - a.createdAt);

        setSharedPhotos(images);
      }
    });

    return () => unSub();
  }, [chatId]);

  const handleBlock = async () => {
    if (!chatUser) return;
    const userDocRef = doc(db, "users", currentuser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked
          ? arrayRemove(chatUser.id)
          : arrayUnion(chatUser.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="details">
      <div className="user">
        <img
          className="avatar"
          src={chatUser?.avatar || "/public/avatar.png"}
          alt=""
        />
        <h2>{chatUser?.username || "User"}</h2>
        <p>Chat Details & Settings</p>
      </div>

      <div className="userInfo">
        <div className="option">
          <div
            className="title"
            onClick={() => setIsOpen((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <span>Shared Photos</span>
            <img
              className="iconsize"
              src={isOpen ? "/public/down.png" : "/public/up.png"}
              alt=""
              style={{ transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
            />
          </div>

          {/* Content scrollable thakbe jodi isOpen true hoy */}
          {isOpen && (
            <div className="photos">
              {sharedPhotos.length > 0 ? (
                sharedPhotos.map((photo, index) => (
                  <div className="photoitems" key={index}>
                    <div className="photodetail">
                      <img src={photo.url} alt="" />
                      <span>
                        {photo.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <a href={photo.url} target="_blank" rel="noreferrer">
                      <img
                        className="iconsize"
                        src="/public/download.png"
                        alt=""
                      />
                    </a>
                  </div>
                ))
              ) : (
                <p className="no-photo">No photos shared</p>
              )}
            </div>
          )}
        </div>

        <button className="blockBtn" onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
              ? "User Blocked"
              : "Block User"}
        </button>
        <button className="logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Details;
