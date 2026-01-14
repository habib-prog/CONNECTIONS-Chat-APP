import React from "react";
import "./Userinfo.css";

const Userinfo = () => {
  return (
    <div className="Userinfo">
      <div className="user">
        <img className="avatar" src="/public/avatar.png" alt="" />
      </div>
      <p>James Xavier</p>
      <div className="icons">
        <img className="more" src="/public/more (1).png" alt="" />
        <img className="video" src="/public/video.png" alt="" />
        <img className="edit" src="/public/edit.png" alt="" />
      </div>
      <div />
    </div>
  );
};

export default Userinfo;
