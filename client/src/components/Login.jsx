import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setId, setUserEmail, setUsername } = useContext(UserContext);
  const navigate = useNavigate();

  async function loginhandle(e) {
    e.preventDefault();
    const { data } = await axios.post("/login", {
      email,
      password,
    });
    console.log(data);
    setUserEmail(email);
    setId(data.id);
    setUsername(data.username);
  }
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <div>
        <form className="w-64 mx-auto " onSubmit={loginhandle}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-sm mb-3 block p-2 border w-full"
            placeholder="Email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-sm mb-3 block p-2 border w-full"
            placeholder="Password"
          />

          <button
            type="submit"
            className="rounded-sm bg-blue-500 block p-2 text-white w-full"
          >
            Login
          </button>
        </form>
      </div>
      <div className="mt-4">
        <span> Dont have an account? </span>

        <button className="hover:text-sky-700" onClick={() => navigate("/")}>
          Register here
        </button>
      </div>
    </div>
  );
}
