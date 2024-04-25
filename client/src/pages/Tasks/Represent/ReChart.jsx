import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toastStyles } from "../../../toastConfig";
import { toast } from "react-toastify";
import { apidomain } from "../../../utils/domain";
import { useSelector } from "react-redux";
import Axios from "axios";
import "./users.css";

function ReChart() {
  const userData = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await Axios.get(`${apidomain}/users`, {
        headers: { Authorization: `${userData.token}` },
      });
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.error("error fetching users", toastStyles.error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div>
      <h1 className="team_members_title">Team Members in TaskMinder</h1>
      <table className="team_table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReChart;
