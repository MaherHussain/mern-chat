import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios.get("/profile", { withCredentials: true }).then((response) => {
      setId(response.data.userData.userId);
      setUsername(response.data.userData.username);
      setUserEmail(response.data.userData.email);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ username, setUsername, id, setId, userEmail, setUserEmail }}
    >
      {children}
    </UserContext.Provider>
  );
}
