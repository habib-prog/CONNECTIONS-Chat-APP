import React, { useState } from "react";
import "./Adduser.css";
import { db } from "../../Database";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useUserStore } from "../../ZustandStore/useUserStore";

const Adduser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentuser } = useUserStore();

  // 🔍 SEARCH USER
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setUser(null);

    const formData = new FormData(e.target);
    const username = formData.get("username")?.trim();

    if (!username) return;

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setUser({
          ...snapshot.docs[0].data(),
          id: snapshot.docs[0].id,
        });
      } else {
        setError("User not found!");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  // ➕ ADD USER
  const handleAdd = async () => {
    if (loading || !user) return;
    setLoading(true);
    setError("");

    try {
      if (user.id === currentuser.id) {
        setError("You cannot add yourself!");
        setLoading(false);
        return;
      }

      const chatId =
        currentuser.id > user.id
          ? `${currentuser.id}_${user.id}`
          : `${user.id}_${currentuser.id}`;

      const chatRef = doc(db, "chats", chatId);

      // 1️⃣ create chat doc if not exists
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          createdAt: serverTimestamp(),
          messages: [],
        });
      }

      // 2️⃣ Update CURRENT USER chat list
      const currentUserChatsRef = doc(db, "userschats", currentuser.id);
      const currentUserChatsSnap = await getDoc(currentUserChatsRef);
      const currentChats = currentUserChatsSnap.exists()
        ? currentUserChatsSnap.data().chats || []
        : [];

      const alreadyAdded = Array.isArray(currentChats)
        ? currentChats.some((c) => c.chatId === chatId)
        : false;

      if (alreadyAdded) {
        setError("User already added!");
        setLoading(false);
        return;
      }

      await updateDoc(currentUserChatsRef, {
        chats: arrayUnion({
          chatId,
          receiverId: user.id,
          lastMessage: "",
          updatedAt: Date.now(),
        }),
      });

      // 3️⃣ Update RECEIVER chat list (optional)
      const receiverChatsRef = doc(db, "userschats", user.id);
      const receiverChatsSnap = await getDoc(receiverChatsRef);
      const receiverChats = receiverChatsSnap.exists()
        ? receiverChatsSnap.data().chats || []
        : [];

      const alreadyAddedReceiver = Array.isArray(receiverChats)
        ? receiverChats.some((c) => c.chatId === chatId)
        : false;

      if (!alreadyAddedReceiver) {
        await updateDoc(receiverChatsRef, {
          chats: arrayUnion({
            chatId,
            receiverId: currentuser.id,
            lastMessage: "",
            updatedAt: Date.now(),
          }),
        });
      }

      setUser(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adduser">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="username"
          placeholder="Search user by username"
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {user && (
        <div className="user">
          <div className="detail">
            <img
              className="avatar"
              src={user.avatar || "/avatar.png"}
              alt="avatar"
            />
            <p>{user.username}</p>

            <button
              onClick={handleAdd}
              disabled={loading}
              style={{ pointerEvents: loading ? "none" : "auto" }}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adduser;
