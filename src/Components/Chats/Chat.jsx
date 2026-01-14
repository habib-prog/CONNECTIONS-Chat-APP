import React, { useState } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const addemo = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };
  console.log(text);
  return (
    <div className="chats">
      <div className="top">
        <div className="userinformation">
          <img className="avatar" src="/public/avatar.png" />
          <div className="text">
            <span className="uname">Kaushik Raj</span>
            <p className="udes">Active now</p>
          </div>
        </div>
        <div className="icons">
          <img className="iconsize" src="/public/phone-call.png" alt="phone" />
          <img className="iconsize" src="/public/video (1).png" alt="video" />
          <img className="iconsize" src="/public/info.png" alt="info" />
        </div>
      </div>
      <div className="center"></div>
      <div className="bottom">
        <div className="icons">
          <img className="iconsize" src="/public/image-.png" alt="image" />
          <img className="iconsize" src="/public/camera.png" alt="camera" />
          <img className="iconsize" src="/public/mic.png" alt="microphone" />
        </div>
        <input
          type="text"
          placeholder="Write message"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="emoji">
          <img
            className="iconsize"
            src="/public/emoji.png"
            alt="emoji"
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={addemo} />
          </div>
        </div>
        <div className="sendbtn">Send</div>
      </div>
    </div>
  );
};

export default Chat;
