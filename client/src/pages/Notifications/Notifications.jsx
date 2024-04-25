import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./notifications.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apidomain } from "../../utils/domain";

function Notifications() {
  const { id } = useParams();
  const userData = useSelector((state) => state.user.user);
  const [notifications, setNotifications] = useState([]);

  const getUserNotifications = async () => {
    try {
      const response = await Axios.get(
        `${apidomain}/notifications/${userData.user_id}`,
        {
          headers: { Authorization: `${userData.token}` },
        }
      );
      console.log( response);
      setNotifications(response.data);
    } catch (response) {
      console.log(response);
    }
  };
 
  useEffect(() => {
    getUserNotifications();
  }, [id]);

  return (
    <div>
      Hello
      <div className="notifications">
        {/* map notifications */}
        {notifications.map((notification) => {
          return (
            <div className="notification__title">
              <h3>{notification.content}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notifications;
