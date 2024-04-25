import React, { useEffect, useState } from "react";
import "./viewtask.css";
import Axios from "axios";
import { apidomain } from "../../../utils/domain";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toastStyles } from "../../../toastConfig";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";

function ViewTask() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [loading, setLoading] = useState(false);
  // const [dueDateFilter, setDueDateFilter] = useState("");

  const getAllTasks = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`${apidomain}/tasks`, {
        headers: { Authorization: `${userData.token}` },
      });
      setTasks(response.data);
      setLoading(false);
      // console.log(response.data);
    } catch (response) {
      console.log(response);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;
    // Apply title filter
    if (titleFilter !== "") {
      const lowercaseTitleFilter = titleFilter.toLowerCase(); // Ignore case
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(lowercaseTitleFilter));
    }

    // Apply priority filter
    if (priorityFilter !== "") {
      filtered = filtered.filter((task) => task.priority === priorityFilter); // Ignore case
    }

    setFilteredTasks(filtered);
  }, [titleFilter, priorityFilter, tasks]);

  return (
    <div className="view_task_page">
      {loading && <Loading />}
      <h2 className="available_tasks">AVAILABE TASKS</h2>
      <div className="filterInfo">
        <div className="filter_section">
          <label>Filter By Title:</label>
          <input type="text" value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} />
        </div>
        <div className="filter_section">
          <label>Filter By Priority:</label>
          <select className="select_priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* mapping  */}
      {filteredTasks.map((task) => {
        // for created at
        const createdAt = new Date(task.created_at);
        const CreatedDate = createdAt.toDateString();
        const TimeCreated = createdAt.toLocaleTimeString();
        // for due date
        const dueDate = new Date(task.due_date);
        const dueDateDate = dueDate.toDateString();
        const dueDateTime = dueDate.toLocaleTimeString();

        return (
          <Link to={`/tasks/${task.task_id}`} key={task.task_id}>
            <div className="task_card" key={task.task_id}>
              <div className="task_title">
                <h4>Task Title: {task.title}</h4>
              </div>
              <div className="moreTaskDetails">
                {/* created at */}
                <div className="date_created">
                  <p className="created_at">Created at: {CreatedDate}</p>
                </div>
                {/* due date */}
                <div className="Due_date">
                  <p>Due Date: {dueDateDate} </p>
                </div>

                <div className="assigned_member">
                  <p>Assigned to: {task.username}</p>
                </div>
                <div className="task_status">
                  <p>Status: {task.status || "Not Yet Started"}</p>
                </div>
                <div className="task_priority">
                  <p>Priotity: {task.priority}</p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ViewTask;
