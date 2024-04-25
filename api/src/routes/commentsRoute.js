import { getAllComments, createComment, updateComment, deleteComment } from "./../controllers/commentController.js";

import { loginRequired } from "./../controllers/userController.js";

const comments = (app) => {
  app
    .route("/comments/:id")
    .get(loginRequired, getAllComments)
    .post(loginRequired, createComment)
    .put(loginRequired, updateComment)
    .delete(loginRequired, deleteComment);
};
export default comments;
