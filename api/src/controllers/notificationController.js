import sql from "mssql";
import config from "./../db/config.js";

// get all notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.user;
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .query("EXEC GetUserNotifications @userID = @user_id");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const { user_id, content, timestamp } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .input("content", sql.VarChar, content)
      .input("timestamp", sql.Date, timestamp)
      .query(
        "INSERT INTO Notifications (user_id, timestamp, content) VALUES (@user_id, GetDate() ,@content)"
      );
    res.status(201).json({ message: "Notification created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Notifications WHERE user_id =  @id");
    res.status(201).json({ message: "Notification deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
