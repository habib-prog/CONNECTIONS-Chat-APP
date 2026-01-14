import React, { useState } from "react";
import "./Chatlist.css";

const Chatlist = () => {
  const [addMode, setaddMode] = useState(false);
  return (
    <div className="Chatlist">
      <div className="search">
        <div className="searchbar">
          <img className="searchIcon" src="/public/search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          className="add"
          src={addMode ? "/public/minus.png" : "/public/add.png"}
          alt=""
          onClick={() => setaddMode((prev) => !prev)}
        />
      </div>
      {/* User ID List */}
      <div className="items">
        <img className="userList" src="/public/woman.png" alt="" />
        <div className="texts">
          <span className="username">Adiled Talukder</span>
          <p className="lastMsg">Hi! James</p>
        </div>
      </div>
      <div className="items">
        <img className="userList" src="/public/woman.png" alt="" />
        <div className="texts">
          <span className="username">Alyson Jaden</span>
          <p className="lastMsg">Hi! James</p>
        </div>
      </div>
      <div className="items">
        <img className="userList" src="/public/woman.png" alt="" />
        <div className="texts">
          <span className="username">Sanjida Lisa</span>
          <p className="lastMsg">Hi! James</p>
        </div>
      </div>
      <div className="items">
        <img className="userList" src="/public/woman.png" alt="" />
        <div className="texts">
          <span className="username">Adiled Talukder</span>
          <p className="lastMsg">Hi! James</p>
        </div>
      </div>
      <div className="items">
        <img className="userList" src="/public/woman.png" alt="" />
        <div className="texts">
          <span className="username">Adiled Talukder</span>
          <p className="lastMsg">Hi! James</p>
        </div>
      </div>
      <div className="items">
        <img className="userList" src="/public/woman.png" alt="" />
        <div className="texts">
          <span className="username">Adiled Talukder</span>
          <p className="lastMsg">Hi! James</p>
        </div>
      </div>
      <div className="items">
        <img className="userList" src="/public/woman.png" alt="" />
        <div className="texts">
          <span className="username">Adiled Talukder</span>
          <p className="lastMsg">Hi! James</p>
        </div>
      </div>
      <div className="items">
        <img className="userList" src="/public/woman.png" alt="" />
        <div className="texts">
          <span className="username">Adiled Talukder</span>
          <p className="lastMsg">Hi! James</p>
        </div>
      </div>
    </div>
  );
};

export default Chatlist;
