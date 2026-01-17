import React, { useState } from "react";
import "./Adduser.css";
import { db } from "../../Database";
import { collection, query, where, getDocs } from "firebase/firestore";

const Adduser = () => {
  const [queryText, setQueryText] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSearchedUser(null);

    if (!queryText.trim()) {
      setError("Username লিখো");
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", queryText)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("User পাওয়া যায়নি");
        return;
      }

      querySnapshot.forEach((doc) => {
        setSearchedUser(doc.data());
      });
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="adduser">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search user by username"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {searchedUser && (
        <div className="user">
          <div className="detail">
            <img
              className="avatar"
              src={searchedUser.avatar || "/default-avatar.png"}
              alt="avatar"
            />
            <p>{searchedUser.username}</p>
            <button>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adduser;
