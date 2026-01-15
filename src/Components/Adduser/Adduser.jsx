import React from "react";
import "./Adduser.css";

const Adduser = () => {
  return (
    <div className="adduser">
      <form>
        <input type="text" placeholder="Search User by ID" />
        <button>Search</button>
      </form>
      <div className="user">
        <div className="detail">
          <img className="avatar" src="/public/Kaushik.png" alt="avatar" />
          <p>Kaushik</p>
          <button>Add</button>
        </div>
      </div>
    </div>
  );
};

export default Adduser;
