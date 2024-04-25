import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./notifications.css";
import { useSelector } from "react-redux";
import { apidomain } from "../../utils/domain";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastStyles } from "../../toastConfig";
import { useParams } from "react-router-dom";
function Notify() {
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
      console.log(response.data);
      setNotifications(response.data);
    } catch (response) {
      console.log(response);
    }
  };
  useEffect(() => {
    getUserNotifications();
  }, []);

  const handleDeleteNotification = async () => {
    try {
      const response = await Axios.delete(
        `${apidomain}/notifications/${id} `,
        {
          headers: { Authorization: `${userData.token}` },
        }
      );
      console.log(response);
      getUserNotifications();
      toast.success("Notification deleted successfully", toastStyles.success);
    } catch (response) {
      console.log(response);
    }
  };

  return (
    <div className="notify_page">
      <h2 className="notify_title">Notifications</h2>

      <div className="notification_wrapper">
        { notifications.length > 0 && 
          <div className="clear_notifications">
          <button onClick={handleDeleteNotification}>
            Clear notifications
          </button>
        </div>
        }
        
        <ol className="ordered_list">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              return (
                <div className="notifications_content" key={index}>
                  <li>{notification.content} </li>
                </div>
              );
            })
          ) : (
            <div className="no_notifications">
              No notifications at the moment🙁
            </div>
          )}
        </ol>
      </div>
    </div>
  );
}

export default Notify;
