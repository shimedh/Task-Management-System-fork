import React from "react";
import "./dashboard.css";
import DashboardGif from "../../Images/DashboardGif.gif";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Dashboard() {
  const userData = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleRegisterBTN = () => {
    navigate("/register");
  };
  const handleLoginBTN = () => {
    navigate("/login");
  };
  return (
    <div className="dashboard_page">
      <div className="right_page">
        <div className="imageGif">
          <img src={DashboardGif} alt="Task gif dashboard" />
        </div>
      </div>

      <div className="description_details">
        <h3 className="intro_base">Efficient Task Management Made Easy</h3>
        <div className="more_detail">
          <h4>Boost Your Productivity by Managing Tasks.</h4>
          <h3 className="teamwork">The power of Team Work</h3>
        </div>
        {!userData ? (
          <p className="start_today"> Start Today: </p>
        ) : (
          <p className="start_today_data">
            Welcome <span>{userData.username}  </span> to TaskMider:
          </p>
        )}

        <div className="home_buttons">
          {!userData ? (
            <>
              <button onClick={handleRegisterBTN}>REGISTER</button>
              <button onClick={handleLoginBTN}>LOGIN</button>
            </>
          ) : (
            <button onClick={() => navigate("/tasks")}>TASKS PAGE</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
