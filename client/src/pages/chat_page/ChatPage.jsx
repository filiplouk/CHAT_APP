import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

function ChatPage() {
  const [users, setUsers] = useState([]);
  const [authorized, setAuthorized] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/chat_page", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setAuthorized(data.authenticated);
        console.log(authorized);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
  //
  //Connect to Web Socket
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });
  }, [navigate]);
  //
  return (
    <div className="chatPage">
      <div className="chatPage__users col-6">Users</div>
      <div className="chatPage__messages col-6">Messages</div>
    </div>
  );
}

export default ChatPage;
