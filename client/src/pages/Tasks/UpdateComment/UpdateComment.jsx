import React, { useEffect, useState } from "react"; 
import "./updatecomment.css";
import { IoSend } from "react-icons/io5";
import Axios from "axios";
import { apidomain } from "../../../utils/domain";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toastStyles } from "../../../toastConfig";

function UpdateComment({ comment, getAllComments }) {
  const userData = useSelector((state) => state.user.user);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    setNewComment(comment.content);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await Axios.put(
      `${apidomain}/comments/${comment.comment_id}`,
      { content: newComment },
      {
        headers: {
          Authorization: `${userData.token}`,
        },
      }
    )
      .then((response) => {
        toast.success(response.data.message, toastStyles.success);
        getAllComments();
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Oops! Something went wrong. Please try again.",
          toastStyles.error
        );
      });
  };
  return (
    <div>
      <form className="updateComment">
        <div className="lets_update_comment">
          <>
            <textarea
              className="inputupdateComment"
              placeholder="Write a comment"
              name="Coment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </>
          <>
            <button
              type="submit"
              className="submitUpdate"
              onClick={handleSubmit}
            >
              <IoSend />
            </button>
          </>
        </div>
      </form>
    </div>
  );
}

export default UpdateComment;
