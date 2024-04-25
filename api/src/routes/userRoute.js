import {
  registerUser,
  loginUser,
  getAllUsers,
} from "../controllers/userController.js";

const user = (app) => {
  app.route("/auth/register").post(registerUser);
  app.route("/auth/login").post(loginUser);
  app.route("/users").get(getAllUsers);
};

export default user;
