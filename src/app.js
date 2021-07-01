require("dotenv").config();
import "regenerator-runtime";
import "./db";
import morgan from "morgan";
import express from "express";
import commentRouter from "./routers/commentRouter";
import listRouter from "./routers/listRouter";
import postRouter from "./routers/postRouter";
import session from "express-session";
import MongoStore from "connect-mongo";
import recommentRouter from "./routers/recommentRouter";
import { localMiddleWare } from "./middleWare";

const port = process.env.PORT;
export const app = express();

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "ejs");
app.use("/static", express.static(process.cwd() + "/src/public"));
app.use("/post/static", express.static(process.cwd() + "/src/public"));
app.use("/post/edit/static", express.static(process.cwd() + "/src/public"));
app.use(morgan("common"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 20,
    },
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGOURL,
    }),
  })
);

app.use(localMiddleWare);

app.use("/", listRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/recomment", recommentRouter);

app.listen(port, () => console.log(`server is running on ${port}`));
