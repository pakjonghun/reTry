import express from "express";
import { getList, getSort, search } from "../controller/listController";
const listRouter = express.Router();

listRouter.get("/", getList);
listRouter.get("/api", getSort);
listRouter.get("/api/search", search);

export default listRouter;
