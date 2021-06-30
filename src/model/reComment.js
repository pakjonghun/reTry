import mongoose from "mongoose";

const reCommentSchema = new mongoose.Schema({
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
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
});

export default mongoose.model("reComment", reCommentSchema);
