import React from "react";
import "./List.css";
import Userinfo from "../Userinfo/Userinfo";
import Chatlist from "../Chatlist/Chatlist";

const List = () => {
  return (
    <div className="lists">
      <Userinfo />
      <Chatlist />
    </div>
  );
};

export default List;
