import React, { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "./UserContext";
import Header from "./Header";
import Contact from "./Contact";
import { uniqBy } from "lodash";
import axios from "axios";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { id, username } = useContext(UserContext);

  useEffect(() => {
    connectToWS();
  }, []);

  function connectToWS() {
    const ws = new WebSocket(`ws://localhost:3001`);
    setWs(ws);
    ws.addEventListener("message", messageHandler);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWS;
      }, 1000);
    });
  }

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
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(ev) {
    ev.preventDefault();
    if (newMessageText.trim() === "") {
      return;
    }
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    );
    setNewMessageText("");
    setMessages((prev) => [
      ...prev,
      {
        sender: id,
        recipient: selectedUserId,
        text: newMessageText,
        _id: Date.now(),
      },
    ]);
  }
  const divUnderMessages = useRef(null);

  // this use effect to do scrolling to last massage
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "start",
      });
    }
  }, [messages]);

  useEffect(() => {
    axios.get("/messages/" + selectedUserId).then((response) => {
      setMessages(response.data);
    });
  }, [selectedUserId]);

  const usersWithoutLoggedinUser = onlineUsers.filter((user) => user.id !== id);
  const selectedUserName = onlineUsers.find(
    (user) => user.id === selectedUserId
  );

  // filter messages and get the message with out dupication by loadash package
  const messagesWithoutDuplicate = uniqBy(messages, "_id");

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
        <div className="messages flex flex-col w-2/3 px-3 py-1">
          <div className="flex-grow">
            {!selectedUserId ? (
              <div className="text-gray-500">Select a user to start chat </div>
            ) : (
              <div className="relative h-full ">
                <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                  <div className="mr-3 pr-3">
                    {messagesWithoutDuplicate.map((message) => (
                      <div
                        className={
                          message.sender === id ? "text-right" : "text-left"
                        }
                        key={message._id}
                      >
                        <div className="inline-block">
                          {message.sender === id ? (
                            <span className="text-gray-500 block text-right">
                              Me
                            </span>
                          ) : (
                            <span className="text-gray-500 block text-left text-sm truncate">
                              {selectedUserName.username}
                            </span>
                          )}
                          <div
                            className={
                              "text-left p-2 my-2 rounded-md text-sm " +
                              (message.sender === id
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-500")
                            }
                          >
                            <p className="px-3 py-2 ">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mb-2" ref={divUnderMessages}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {selectedUserId && (
            <div className="self-end w-full z-50">
              <form onSubmit={sendMessage} className="">
                <div className="flex gap-2 mb-1 ">
                  <textarea
                    onChange={(e) => setNewMessageText(e.target.value)}
                    value={newMessageText}
                    type="text"
                    rows="3"
                    className="flex-grow px-1 rounded-md  "
                    style={{ resize: "none", fontSize: "18px" }}
                  />
                  <button
                    className="text-white bg-blue-500 px-3 rounded-md border-sky-500  hover:bg-blue-700"
                    type="submit"
                  >
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
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
