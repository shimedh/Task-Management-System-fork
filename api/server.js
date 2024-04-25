import express from "express";
import config from "./src/db/config.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();

import user from "./src/routes/userRoute.js";
import comments from "./src/routes/commentsRoute.js";
import tasks from "./src/routes/tasksRoutes.js";
import notifications from "./src/routes/notificationsRoute.js";

//built inmiddleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT middleware
app.use((req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      config.jwt_secret,
      (err, decode) => {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

// routes access app 
user(app);
comments(app);
tasks(app);
notifications(app);

app.get("/", (req, res) => {
  res.send("Welcome to TaskMinder API");
});

//port
app.listen(config.port || 5000, () => {
  console.log(`Server running on port ${config.port}`);
});
