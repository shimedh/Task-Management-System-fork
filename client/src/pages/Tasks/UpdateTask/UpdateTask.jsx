import React, { useEffect, useState } from "react";
import "./updateTask.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { apidomain } from "../../../utils/domain";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toastStyles } from "../../../toastConfig";
import { validateForm } from "./formValidation";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../components/Loading/Loading";

function UpdateTask({ setshowUpdateForm, task, fetchSingleTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigned_to, setAssigned_to] = useState("");
  const [due_date, setDue_date] = useState("");
  const [priority, setPriority] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssigned_to(task.assigned_to || "");
      const formattedDueDate = task.due_date.split("T")[0];
      setDue_date(formattedDueDate);
      setPriority(task.priority || "");
      setStatus(task.status || "Not started");
    }
  }, [task]);

  const [users, setUsers] = useState([]);
  const userData = useSelector((state) => state.user.user);
  // const navigate = useNavigate();

  // get request to fetch all users in the database
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`${apidomain}/users`, {
        headers: {
          Authorization: `${userData.token}`,
        },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("error fetching users", toastStyles.error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  // clossing the submit form
  const handleClose = () => {
    setshowUpdateForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const errors = validateForm(title, description, assigned_to, due_date, priority, status);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setLoading(true);
        const response = await Axios.put(
          `${apidomain}/tasks/${task.task_id}`,
          {
            title: title,
            description: description,
            assigned_to: assigned_to,
            due_date: due_date,
            priority: priority,
            status: status,
          },
          {
            headers: {
              Authorization: `${userData.token}`,
            },
          }
        );
        // console.log(response.data.message);
        toast.success(response.data.message, toastStyles.success);
        
        fetchSingleTask();
        setLoading(false);
      } catch (response) {
        // alert("an error occured, please try again");
        toast.error("an error occured, please try again later", toastStyles.error);
        // console.log(response);
      }
    }
  };

  return (
    <div className="create_task_page">
      {loading && <Loading />}
      <form name="update form">
        <div className="task_form">
          <div>
            <label className="task_title">Task Title</label>
            <br />
            <input className="title_input" type="text" placeholder="your task title" value={title} onChange={(e) => setTitle(e.target.value)} name="title" />
            {errors.title && <span className="errors">{errors.title}</span>}
          </div>
          <br />
          <div>
            <label className="task_description">Description</label>
            <br />
            <textarea className="description_input" cols="30" rows="10" placeholder="your task description" value={description} onChange={(e) => setDescription(e.target.value)} name="description"></textarea>
            {errors.description && <span className="errors">{errors.description}</span>}
          </div>
          <br />
          <div>
            <label className="task_assign_to">Assign Task To</label>
            <br />
            <div className="check_member">
              {/* getting all users in the database */}
              {users.map((user) => (
                <React.Fragment key={user.user_id}>
                  <input type="radio" value={user.user_id} name="assigned_to" onChange={(e) => setAssigned_to(e.target.value)} />
                  <label>{user.username}</label>
                </React.Fragment>
              ))}
            </div>
            {errors.assigned_to && <span className="errors">{errors.assigned_to}</span>}
          </div>
          <div className="task_progress">
            <label className="task_progress">Task Progress</label>
            <br />
            {/* select for task progress */}
            <select className="select_progress" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
            {errors.status && <span className="errors">{errors.status}</span>}
          </div>
          <br />
          <div>
            <label className="task_dueDate">Due Date</label>
            <br />
            <input type="date" name="due_date" className="dueDate_calender" value={due_date} onChange={(e) => setDue_date(e.target.value)} />
            {errors.due_date && <span className="errors">{errors.due_date}</span>}
          </div>
          <br />
          <div>
            <label className="task_priority">Priority</label>
            <br />
            <div className="radio_task">
              <input type="radio" name="priority" value="High" className="radio_priority" checked={priority === "High"} onChange={(e) => setPriority(e.target.value)} />
              <label className="task_priority">High</label>
              <input type="radio" name="priority" value="Medium" className="radio_priority" checked={priority === "Medium"} onChange={(e) => setPriority(e.target.value)} />
              <label className="task_priority">Medium</label>
              <input type="radio" name="priority" value="Low" className="radio_priority" checked={priority === "Low"} onChange={(e) => setPriority(e.target.value)} />
              <label className="priority">Low</label>
            </div>
            {errors.priority && <span className="errors">{errors.priority}</span>}
          </div>
          <br />
          <div className="updateBTN">
            <button onClick={handleClose} className="updatetask">
              Close
            </button>
            <button onClick={handleUpdate} className="updatetask">
              Update Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateTask;
