import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../Database"; // adjust path
import "./Userinfo.css";

const Userinfo = () => {
  const [user, setUser] = useState({
    username: "",
    avat: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser({
          username: docSnap.data().username,
          avatar: docSnap.data().avatar,
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="Userinfo">
      <div className="user">
        <img
          className="avatar"
          src={user.avatar || "/default-avatar.png"}
          alt="User Avatar"
        />
      </div>
      <p>{user.username || "Guest"}</p>
      <div className="icons">
        <img className="more" src="/more (1).png" alt="More" />
        <img className="video" src="/video.png" alt="Video" />
        <img className="edit" src="/edit.png" alt="Edit" />
      </div>
    </div>
  );
};

export default Userinfo;
