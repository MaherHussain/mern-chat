import React, { useState } from "react";
import Avatar from "./Avatar";
// eslint-disable-next-line react/prop-types
export default function Contact({ username, userId }) {
  return (
    <div className="flex w-full gap-2 items-center border-b p-2">
      <Avatar username={username} userId={userId} />
      <span className=" ">{username}</span>
    </div>
  );
}
