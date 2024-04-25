import React from "react";
import "./sidenav.css";

import taskicon from "../../../Images/task-Icon.png";
import { BiAddToQueue } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import {AiOutlineTeam} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { display } from "../../../Redux/apiCall";

function SideNav() {
  const dispatch = useDispatch();
  const handleCreateTask = () => {
    console.log("create task clicked");
    display(dispatch, "createTask");
  };
  const handleViewTask = () => {
    console.log("view task clicked");
    display(dispatch, "viewTask");
  };
  const handleContact = () => {
    console.log("view task clicked");
    display(dispatch, "contactPage");
  };
  return (
    <div className="side_nav">
      {/* LOGO */}
      <div className="task_logo">
        <div className="logotask">
          <img src={taskicon} alt="task icon" />
        </div>
      </div>
      {/* Create Task */}

      <div className="create_task" onClick={handleCreateTask}>
        <BiAddToQueue className="addTask" />
        Create Task
      </div>

      {/* View Tasks */}
      <div className="view_Tasks" onClick={handleViewTask}>
        <FaTasks className="view" />
        View Tasks
      </div>
      {/* Contact Us */}
      <div className="contact_us" onClick={handleContact}>
        <AiOutlineTeam className="contacticon" />
        Team Members
      </div>
    </div>
  );
}

export default SideNav;
