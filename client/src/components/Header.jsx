import React, { useContext } from "react";
import PropTypes from "prop-types";
import { UserContext } from "./UserContext";
export default function Header() {
  const { username } = useContext(UserContext);
  return (
    <div className="header flex flex-row p-5 bg-blue-500 text-white">
      <p className="grow ">
        Hello <span className="font-bold">{username}</span>{" "}
      </p>
      <div className="flex-none w-15">
        <button className="rounded-sm p-3 hover:text-red-700">Logout</button>
      </div>
    </div>
  );
}
