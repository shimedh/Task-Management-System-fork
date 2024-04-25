import React from "react";
import "./mainbar.css";

import CreateTask from "../CreateTask/CreateTask";
import ViewTask from "../ViewTasks/ViewTask";
import { useSelector } from "react-redux";
import ReChart from "./../Represent/ReChart";

function MainBar() {
  const selectedComponent = useSelector((state) => state.ui.selectedComponent);
  console.log("selectedComponent", selectedComponent);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "createTask":
        return <CreateTask />;
      case "viewTask":
        return <ViewTask />;
      case "contactPage":
        return <ReChart />;
      default:
        return <ViewTask />;
    }
  };
  return (
    <div className="main_bar">
      <div className="main_wrapper">{renderComponent()}</div>
    </div>
  );
}

export default MainBar;
