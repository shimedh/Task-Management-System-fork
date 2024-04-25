import {
  getAllTasks,
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
} from "./../controllers/taskController.js";

import { loginRequired } from "../controllers/userController.js"; 

const tasks = (app) => {
  app
    .route("/tasks")
    .get(loginRequired, getAllTasks)
    .post(loginRequired, createTask);

  app
    .route("/tasks/:id")
    .get(loginRequired, getSingleTask)
    .put(loginRequired, updateTask)
    .delete(loginRequired, deleteTask);
};

export default tasks;
