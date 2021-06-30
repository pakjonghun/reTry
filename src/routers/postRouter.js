import express, { Router } from "express";
import {
  deletePost,
  getAdd,
  getEdit,
  getPost,
  getPostApi,
  postAdd,
  postEdit,
} from "../controller/postController";
const postRouter = express.Router();

postRouter.route("/add").get(getAdd).post(postAdd);
postRouter.get("/:id", getPost);
postRouter.get("/api/:id", getPostApi);
postRouter.route("/edit/:id").get(getEdit).post(postEdit);
postRouter.delete("/delete/:id", deletePost);

export default postRouter;
