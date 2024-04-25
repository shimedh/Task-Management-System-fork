import sql from "mssql";
import config from "./../db/config.js";

// get all comments
export const getAllComments = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    let result = await pool.request().input("id", sql.Int, id).query("GetCommentDetails @taskID = @id");

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create a comment
export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;
    const { content, timestamp } = req.body;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("user_id", sql.Int, user_id)
      .input("content", sql.VarChar, content)
      .input("timestamp", sql.Date, timestamp)
      .query("INSERT INTO Comments (task_id, user_id, content, timestamp) VALUES (@id, @user_id, @content, GetDate())");
    res.status(201).json({ message: "Comment created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update a comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;
    const { content } = req.body;
    let pool = await sql.connect(config.sql);
    let result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("user_id", sql.Int, user_id)
      .input("content", sql.VarChar, content)
      .query("UPDATE Comments SET content = @content WHERE comment_id = @id AND user_id = @user_id");

    res.status(200).json({ message: "Comment updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("user_id", sql.Int, user_id)
      .query("DELETE FROM Comments WHERE comment_id = @id AND user_id = @user_id");

    res.status(200).json({ message: "Comment deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
