import "regenerator-runtime";
const dotenv = require("dotenv");
dotenv.config();

import "./db.js";
import "./model/comment.js";
import "./model/post.js";
import "./model/reComment.js";
import { app } from "./app.js";

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server is running on server"));
