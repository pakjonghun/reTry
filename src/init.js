import "regenerator-runtime";
require("dotenv").config();
import "./db.js";
import "./model/comment.js";
import "./model/post.js";
import "./model/reComment.js";
import app from "./app.js";

const port = 4000;
app.listen(port, () => console.log("server is running on server"));
