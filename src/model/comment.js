import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  writer: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  reComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReComment" }],
});

export default mongoose.model("Comment", commentSchema);
