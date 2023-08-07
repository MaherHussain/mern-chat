import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import Header from "./Header";
import Contact from "./Contact";
export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { id } = useContext(UserContext);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/login");
    setWs(ws);
    ws.addEventListener("message", messageHandler);
  }, []);
  function showOnlineUsers(onlineUsers) {
    const uniqueUsers = [];
    const userIds = new Set(); // To keep track of seen user IDs and ensure uniqueness
    onlineUsers.forEach(({ id, username }) => {
      if (!userIds.has(id)) {
        userIds.add(id);
        uniqueUsers.push({ id, username });
      }
    });
    setOnlineUsers(uniqueUsers);
  }
  function messageHandler(e) {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlineUsers(messageData.online);
    }
  }

  const usersWithoutLoggedinUser = onlineUsers.filter((user) => user.id !== id);
  return (
    <div className="chat flex flex-col h-screen">
      <Header />
      <div className="chat-content flex flex-row h-screen">
        <div className="contacts w-1/3 bg-white py-5">
          {usersWithoutLoggedinUser.map((user) => (
            <div
              className={
                "flex cursor-pointer " +
                "" +
                (user.id === selectedUserId ? "bg-blue-200" : "")
              }
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
            >
              {user.id === selectedUserId && (
                <div className="w-1 h-12 bg-blue-500 rounded-r-md"></div>
              )}
              <Contact username={user.username} userId={user.id} />
            </div>
          ))}
        </div>
        <div className="messages flex flex-col w-2/3 px-5">
          <div className="flex  grow items-center justify-center ">
            {!selectedUserId ? (
              <div className="text-gray-500">Select a user to start chat </div>
            ) : (
              <div>Messages</div>
            )}
          </div>
          {selectedUserId && (
            <div className="self-end h-14 w-full flex gap-4 mb-2 border-1">
              <textarea
                type="text"
                className="flex-grow px-1 rounded-3"
                style={{ resize: "none", fontSize: "18px" }}
              />
              <button className="text-white bg-black px-3 rounded-3" rows="5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
