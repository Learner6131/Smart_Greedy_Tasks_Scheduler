import React from "react";
import Clearkauth from "./clearkauth";

function Header() {
  return (
    <div className="flex justify-between items-center p-4 sticky bg-gray-800 text-white width-full">
      <div className="logo">
        <h2>Task Manager</h2>
      </div>
      <div className="nav flex space-x-4">
        <a href="/dashboard" className="text-white hover:text-gray-400">
          {" "}
          DashBoard{" "}
        </a>
        <a href="/addtasks" className="text-white hover:text-gray-400">
          {" "}
          Add Tasks{" "}
        </a>
        <a href="/TodaysSchedule" className="text-white hover:text-gray-400">
          {" "}
          Todays Tasks{" "}
        </a>
      </div>

      <div className="user">
        <Clearkauth />
      </div>
    </div>
  );
}

export default Header;
