import morgan from "morgan";
import express from "express";
import commentRouter from "./routers/commentRouter.js";
import listRouter from "./routers/listRouter.js";
import postRouter from "./routers/postRouter.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localMiddleWare } from "./middleWare.js";

const app = express();

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

    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "https://cloud.mongodb.com/v2/60dd3223b7da3255fb3093d2#:~:text=mongodb%2Bsrv%3A//fireking5997%3A%3Cpassword%3E%40cluster0.1p2vs.mongodb.net/myFirstDatabase%3FretryWrites%3Dtrue%26w%3Dmajority",
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

export default app;
