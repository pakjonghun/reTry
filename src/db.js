import mongoose from "mongoose";

mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => console.log("DB is working"));
db.on("error", (error) => console.log(error));
