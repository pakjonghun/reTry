import express from "express";
import {
  commentDelete,
  commentEdit,
  postComment,
} from "../controller/commentController.js";
const commentRouter = express.Router();

commentRouter.post("/add", postComment);
commentRouter.patch("/edit", commentEdit);
commentRouter.delete("/delete", commentDelete);

export default commentRouter;
