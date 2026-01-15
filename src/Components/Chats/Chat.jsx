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
          <img className="avatar" src="/public/Kathy.jpeg" />
          <div className="text">
            <span className="uname">Carol Kathy</span>
            <p className="udes">Active now</p>
          </div>
        </div>
        <div className="icons">
          <img className="iconsize" src="/public/phone-call.png" alt="phone" />
          <img className="iconsize" src="/public/video (1).png" alt="video" />
          <img className="iconsize" src="/public/info.png" alt="info" />
        </div>
      </div>
      <div className="center">
        {/* msg start 1 */}
        <div className="msg">
          <img className="iconsize" src="/public/avatar.png" alt="" />
          <div className="texts">
            <p className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              obcaecati nostrum
            </p>
            <span className="time">sent 1 minuite ago</span>
          </div>
        </div>
        {/* msg start 2 */}
        <div className="msg own">
          {/* <img className="iconsize" src="/public/avatar.png" alt="" /> */}
          <div className="texts">
            <p className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              obcaecati nostrum
            </p>
            <span className="time">sent 1 minuite ago</span>
          </div>
        </div>
        {/* Own msg 3 */}
        <div className="msg ">
          <img className="iconsize" src="/public/avatar.png" alt="" />
          <div className="texts">
            <p className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              obcaecati nostrum
            </p>
            <span className="time">sent 1 minuite ago</span>
          </div>
        </div>
        {/* Own msg 4 */}
        <div className="msg own">
          {/* <img className="iconsize" src="/public/avatar.png" alt="" /> */}
          <div className="texts">
            <p className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              obcaecati nostrum
            </p>
            <span className="time">sent 1 minuite ago</span>
          </div>
        </div>
        {/* Own msg 5 */}
        <div className="msg ">
          <img className="iconsize" src="/public/avatar.png" alt="" />
          <div className="texts">
            <p className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              obcaecati nostrum
            </p>
            <span className="time">sent 10 minuite ago</span>
          </div>
        </div>
        {/* Own msg 6 */}
        <div className="msg own">
          {/* <img className="iconsize" src="/public/avatar.png" alt="" /> */}
          <div className="texts">
            <p className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              obcaecati nostrum
            </p>
            <span className="time">Seen 8 minuite ago</span>
          </div>
        </div>
        {/* Own msg 7 */}
        <div className="msg ">
          <img className="iconsize" src="/public/avatar.png" alt="" />
          <div className="texts">
            <p className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              obcaecati nostrum
            </p>
            <span className="time">sent 5 minuite ago</span>
          </div>
        </div>
        {/* Own msg 8 */}
        <div className="msg own">
          {/* <img className="iconsize" src="/public/avatar.png" alt="" /> */}
          <div className="texts">
            <img src="/public/Kathy.jpeg" alt="" />
            <p className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              obcaecati nostrum
            </p>
            <span className="time">Seen 1 minuite ago</span>
          </div>
        </div>
        {/* Own msg 9 */}
        <div className="msg ">
          <img className="iconsize" src="/public/avatar.png" alt="" />
          <div className="texts">
            <img
              src="/public/WhatsApp Image 2025-12-31 at 14.33.03.jpeg"
              alt=""
            />
            <p className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              obcaecati nostrum
            </p>
            <span className="time">Sent 1 minuite ago</span>
          </div>
        </div>
      </div>
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
