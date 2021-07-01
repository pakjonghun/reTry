const dotenv = require("dotenv");
dotenv.config();
import morgan from "morgan";
import express from "express";
import commentRouter from "./routers/commentRouter.js";
import listRouter from "./routers/listRouter.js";
import postRouter from "./routers/postRouter.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localMiddleWare } from "./middleWare.js";

export const app = express();

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "ejs");
app.use("/static", express.static(process.cwd() + "/src/public"));
app.use("/post/static", express.static(process.cwd() + "/src/public"));
app.use("/post/edit/static", express.static(process.cwd() + "/src/public"));
app.use(morgan("common"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
console.log(process.env.MONGOURL);
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGOURL,
    }),
    cookie: {
      maxAge: 1000 * 60 * 20,
    },
  })
);

app.use(localMiddleWare);

app.use("/", listRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
