import React from "react";
import "./Details.css";

const Details = () => {
  return (
    <div className="details">
      <div className="user">
        <img className="avatar" src="/public/Kathy.jpeg" alt="userImage" />
        <h2>Carol Kathy</h2>
        <p>Lorem ipsum dolor sit, amet consectetur </p>
      </div>
      <div className="userInfo">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img className="iconsize" src="/public/arrow-up.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Policy</span>
            <img className="iconsize" src="/public/arrow-up.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img className="iconsize" src="/public/down.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoitems">
              <div className="photodetail">
                <img src="/public/Kathy.jpeg" alt="" />
                <span>2024</span>
              </div>
              <img className="iconsize" src="/public/download.png" alt="" />
            </div>
            <div className="photoitems">
              <div className="photodetail">
                <img src="/public/Kathy.jpeg" alt="" />
                <span>2024</span>
              </div>
              <img className="iconsize" src="/public/download.png" alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img className="iconsize" src="/public/arrow-up.png" alt="" />
          </div>
        </div>
        <button>Block User</button>
        <button>Log Out</button>
      </div>
    </div>
  );
};

export default Details;
