import Post from "../model/post";
import Comment from "../model/comment";

export const postComment = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: "No page" });
    }

    const comment = await Comment.create({ ...req.body, post: id });
    post.comments.push(comment._id);
    post.save();
    res.status(201).json({ commentId: comment._id });
  } catch (e) {
    console.log(e);
    res.status(404).json({ msg: "error" });
  }
};

export const commentEdit = async (req, res) => {
  const { id, content } = req.body;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ mes: "커멘트가 존재하지 않습니다." });
    }

    await Comment.updateOne({ _id: id }, { content });
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

export const commentDelete = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.remove({ _id: id });
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
