import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
    required: true,
  },
  view: Number,
  content: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  password: {
    type: String,
    require: true,
  },
});
export default mongoose.model("Post", postSchema);
