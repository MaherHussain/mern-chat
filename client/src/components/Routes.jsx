import React, { useContext } from "react";
import { UserContext } from "./UserContext";

import { Routes as Router, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

export default function Routes() {
  const { username, userEmail } = useContext(UserContext);
  if (username || userEmail) {
    return "logged in " + username;
  }

  return (
    <Router>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Router>
  );
}
