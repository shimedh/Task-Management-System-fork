import sql from "mssql";
import config from "./../db/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//loginRequired
export const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user!" });
  }
};

// register a user
export const registerUser = async (req, res) => {
  const { username, password, email, role } = req.body;
  const hashedpassword = bcrypt.hashSync(password, 10);
  console.log(username, email, hashedpassword);
  try {
    let pool = await sql.connect(config.sql);
    let result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .query(
        " SELECT * FROM Users WHERE username = @username OR email = @email"
      );
    const user = result.recordset[0];
    if (user) {
      return res.status(409).json({ error: "User already exists" });
    } else {
      await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("email", sql.VarChar, email)
        .input("role", sql.VarChar, role)
        .input("hashedpassword", sql.VarChar, hashedpassword)
        .query(
          "INSERT INTO Users (username, email, role, hashedpassword) VALUES (@username, @email, @role, @hashedpassword)"
        );
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let pool = await sql.connect(config.sql);
    let result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");
    const user = result.recordset[0];
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    } else {
      if (!bcrypt.compareSync(password, user.hashedpassword)) {
        return res.status(401).json({ error: "Incorrect password" });
      } else {
        const token = `JWT ${jwt.sign(
          {
            email: user.email,
            user_id: user.user_id,
            username: user.username,
          },
          config.jwt_secret,
          { expiresIn: "30d" }
        )}`;
        res.status(200).json({
          username: user.username,
          role: user.role,
          email: user.email,
          user_id: user.user_id,
          token: token,
          profilePicUrl: user.profilePicUrl,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    let result = await pool
      .request()
      .query("SELECT user_id, username, role, email FROM Users");
    const users = result.recordset;
    if (!users) {
      return res.status(401).json({ error: "No users found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
