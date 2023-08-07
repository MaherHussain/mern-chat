import React from "react";
import axios from "axios";
import Routes from "./components/Routes";
import { UserContextProvider } from "../src/components/UserContext";

export default function App() {
  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <div className="bg-blue-50 h-screen">
        <Routes />
      </div>
    </UserContextProvider>
  );
}
