import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { BsPencilFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import Axios from "axios";
import { useParams } from "react-router-dom";
import "./discussions.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { apidomain } from "../../../utils/domain";
import UpdateComment from "./../UpdateComment/UpdateComment";
import { toastStyles } from "../../../toastConfig";

function Discussions() {
  const { id } = useParams();
  const userData = useSelector((state) => state.user.user);
  const [commentsDetails, setCommentsDetails] = useState([]);
  const [showEditForm, setShowEditForm] = useState({});
  const [tempComment, setTempComment] = useState([]);

  const getAllComments = async () => {
    try {
      const response = await Axios.get(`${apidomain}/comments/${id}`, {
        headers: {
          Authorization: `${userData.token}`,
        },
      });
      console.log(response.data);
      setCommentsDetails(response.data);
    } catch (response) {
      console.log(response);
    }
  };

  const textareaRef = React.useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.Coment.value === "") {
      toast.error("Comment cannot be empty", toastStyles.error);
      return;
    }

    const content = e.target.Coment.value;
    const data = {
      content: content,
    };

    Axios.post(`${apidomain}/comments/${id}`, data, {
      headers: {
        Authorization: `${userData.token}`,
      },
    })
      .then((response) => {
        toast.success(response.data.message, toastStyles.success);
        textareaRef.current.value = "";
        getAllComments();
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Oops! Something went wrong. Please try again.",
          toastStyles.error
        );
        textareaRef.current.value = "";
      });
  };

  const handleCommentDelete = async (id) => {
    try {
      const response = await Axios.delete(`${apidomain}/comments/${id}`, {
        headers: {
          Authorization: `${userData.token}`,
        },
      });
      // console.log(response.data.message);
      toast.success(response.data.message, toastStyles.success);
      getAllComments();
    } catch (error) {
      // console.log(error);
      toast.error(
        "Oops! Something went wrong. Please try again.",
        toastStyles.error
      );
    }
  };

  useEffect(() => {
    getAllComments();
  }, []);

  const handleEditToggle = (comment) => {
    setShowEditForm((prevState) => ({
      ...prevState,
      [comment.comment_id]: !prevState[comment.comment_id],
    }));
    setTempComment(comment);
  };

  return (
    <div className="comments_page">
      <h2 className="comment_title">Comments</h2>

      <div className="wrap_comments">
        {commentsDetails &&
          commentsDetails.map((comment, index) => {
            const timestamp = new Date(comment.timestamp).toLocaleString();
            const isCurrentUserComment = comment.username === userData.username;
            const chatClass = isCurrentUserComment
              ? "chat_bubble_right"
              : "chat_bubble_left";

            return (
              <div className={`comment_card ${chatClass}`} key={index}>
                <div className="upper_div">
                  <p> {comment.username}</p>
                  <p> {timestamp}</p>
                </div>
                {/* <p>Title for task: {comment.title}</p> */}

                <p className="comment_content">{comment.content}</p>
                <div className="edit_delete">
                  {userData && userData.user_id === comment.user_id && (
                    <div className="edit_comment">
                      <BsPencilFill onClick={() => handleEditToggle(comment)} />
                      {showEditForm[comment.comment_id] && (
                        <UpdateComment
                          comment={tempComment}
                          getAllComments={getAllComments}
                        />
                      )}
                    </div>
                  )}

                  {/* here */}
                  {userData && userData.user_id === comment.user_id && (
                    <div className="delete_comment">
                      <FaTrash
                        onClick={() => handleCommentDelete(comment.comment_id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        <form onSubmit={handleSubmit} className="myFormComments">
          <div className="form_for_comments">
            <div className="textarea">
              <textarea
                className="inputComment"
                placeholder="Write a comment"
                name="Coment"
                ref={textareaRef}
              />
            </div>

            <button type="submit" className="sbmtComment">
              <IoSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Discussions;
