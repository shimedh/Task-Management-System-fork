import React from "react";
import "./navbar.css";

import { Link } from "react-router-dom";
import Icon from "../../Images/Icon.png";
import { ImHome } from "react-icons/im";
import { FaTasks } from "react-icons/fa";
import { GiArchiveRegister } from "react-icons/gi";
import { MdOutlineLogin } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineNotification } from "react-icons/ai";
import { useSelector } from "react-redux";

function Navbar() {
  const userData = useSelector((state) => state.user.user);
  console.log(userData);

  return (
    <div className="navbar_page">
      <ul>
        {/* first nav div */}
        <div className="first_nav">
          <div className="myLogo">
            <img src={Icon} alt="icon" />
          </div>

          <li>
            <Link to="/">
              <ImHome /> Dashboard
            </Link>
          </li>

          {userData && (
            <li>
              <Link to="/tasks">
                <FaTasks /> Tasks
              </Link>
            </li>
          )}
        </div>
        {/* second nav div */}
        <div className="second_nav">
          {userData ? (
            <>
              <li>
                <Link to={`/notifications/${userData.user_id}`}>
                  <AiOutlineNotification /> Notifications
                </Link>
              </li>

              <li>
                <Link to="/profile">
                  <AiOutlineUserAdd /> {userData.username}
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">
                  <GiArchiveRegister /> Register
                </Link>
              </li>

              <li>
                <Link to="/login">
                  <MdOutlineLogin /> Login
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </div>
  );
}

export default Navbar;
