import sql from "mssql";
import config from "./../db/config.js";
import nodeMailer from "nodemailer";
const { mail_password } = config;

// get all tasks
export const getAllTasks = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    let result = await pool.request().query("EXEC GetTaskDetails");

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Create a task
// Create a task
export const createTask = async (req, res) => {
  // Get the user's email from the request
  const { email } = req.user;

  try {
    const { title, description, created_at, due_date, priority, status, assigned_to } = req.body;

    // Connect to the SQL database
    let pool = await sql.connect(config.sql);

    // Insert the new task into the Tasks table
    await pool
      .request()
      .input("title", sql.VarChar, title)
      .input("description", sql.VarChar, description)
      .input("created_at", sql.Date, created_at)
      .input("due_date", sql.Date, due_date)
      .input("priority", sql.VarChar, priority)
      .input("status", sql.VarChar, status)
      .input("assigned_to", sql.Int, assigned_to)
      .query(
        "INSERT INTO Tasks (title, description, created_at, due_date, priority, status, assigned_to) VALUES (@title, @description, GETDATE(), @due_date, @priority, @status, @assigned_to)"
      );

    // Get the email of the assigned user from the Users table
    const assignedUser = await pool
      .request()
      .input("assigned_to", sql.Int, assigned_to)
      .query("SELECT email FROM Users WHERE user_id = @assigned_to");

    const assignedToEmail = assignedUser.recordset[0].email;
    console.log(assignedToEmail);

    // Send email to the assigned user
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "bkemboi590@gmail.com",
        pass: mail_password,
      },
    });
    let mailOptions = {
      from: email,
      to: assignedToEmail,
      subject: "You've just received a new task through the TaskMinder App!",
      html: `<h2>Here is the Task details</h2>
         <p>Title: ${title}</p>
         <p>Description: ${description}</p>
         <p>Priority: ${priority}</p>
         <p>Click the link: <a href="https://yellow-dune-0686bdb0f.3.azurestaticapps.net/">Visit TaskMinder</a></p>  
         `,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error Occurred", err);
        res.status(500).json({ error: "Error sending email." });
      } else {
        console.log(`Email sent to ${data.response}`);
        res.status(201).json({ message: "Task created successfully!" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task
export const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    let result = await pool.request().input("id", sql.Int, id).query("EXEC GetSingleTaskDetails @taskID = @id");

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  const { email } = req.user;
  try {
    const { id } = req.params;
    const { title, description, created_at, due_date, priority, status, assigned_to } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("title", sql.VarChar, title)
      .input("description", sql.VarChar, description)
      .input("created_at", sql.Date, created_at)
      .input("due_date", sql.Date, due_date)
      .input("priority", sql.VarChar, priority)
      .input("status", sql.VarChar, status)
      .input("assigned_to", sql.Int, assigned_to)
      .query(
        "UPDATE Tasks SET title = @title, description = @description, created_at =  GETDATE(), due_date = @due_date, priority = @priority, status = @status, assigned_to = @assigned_to WHERE task_id = @id"
      );

    // Get the email of the assigned user from the Users table
    const assignedUser = await pool
      .request()
      .input("assigned_to", sql.Int, assigned_to)
      .query("SELECT email FROM Users WHERE user_id = @assigned_to");

    const assignedToEmail = assignedUser.recordset[0].email;
    console.log(assignedToEmail);

    // Send email to the assigned user
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "bkemboi590@gmail.com",
        pass: mail_password,
      },
    });
    let mailOptions = {
      from: email,
      to: assignedToEmail,
      subject: "You've just received a new task through the TaskMinder App!",
      html: `<h2>Here is the Task details</h2>
         <p>Title: ${title}</p>
         <p>Description: ${description}</p>
         <p>Priority: ${priority}</p>
         <p>Click the link <a href="https://yellow-dune-0686bdb0f.3.azurestaticapps.net/">Visit TaskMinder</a></p>  
         `,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error Occurred", err);
        res.status(500).json({ error: "Error sending email." });
      } else {
        console.log(`Email sent to ${data.response}`);
        res.status(201).json({ message: "Task updated successfully!" });
      }
    });

    // res.status(200).json({ message: "Task updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    await pool.request().input("id", sql.Int, id).query("DELETE FROM Tasks WHERE task_id = @id");
    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
