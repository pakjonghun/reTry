import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => console.log("DB is working"));
db.on("error", (error) => console.log(error));
