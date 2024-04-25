import React from "react";
import "./tasks.css";
import SideNav from "./SideNav/SideNav";
import MainBar from "./MainBar/MainBar";
function Tasks() {
  return (
    <div className="tasks_page">
      <SideNav />
      <MainBar />
    </div>
  );
}

export default Tasks;
