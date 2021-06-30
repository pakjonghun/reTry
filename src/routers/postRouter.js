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
postRouter.post("/edit/:id", postEdit);
postRouter.get("/edit/:id", getEdit);
postRouter.delete("/delete/:id", deletePost);

postRouter.post("/add", postAdd);

export default postRouter;
