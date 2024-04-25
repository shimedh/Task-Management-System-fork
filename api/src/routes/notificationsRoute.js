import {
  getUserNotifications,
  createNotification,
  deleteNotification,
} from "../controllers/notificationController.js";
import { loginRequired } from "../controllers/userController.js";

const notifications = (app) => {
  app
    .route("/notifications/:id")
    .get(loginRequired, getUserNotifications)
    .delete(loginRequired, deleteNotification);
  app.route("/notifications").post(loginRequired, createNotification);
};

export default notifications;
