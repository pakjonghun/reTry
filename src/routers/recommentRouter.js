import express from "express";
import { recommentAdd } from "../controller/recommentController";
const recommentRouter = express.Router();

recommentRouter.patch("/add", recommentAdd);

export default recommentRouter;
