import Post from "../model/post.js";
import Comment from "../model/comment.js";

export const postComment = async (req, res) => {
  const { writer, content, postId: _id } = req.body;
  try {
    const isExist = await Post.findById(_id);
    if (!isExist) {
      return res.sendStatus(409);
    }
    const comment = await Comment.create({ writer, content, post: _id });
    const comment_id = comment._id;
    isExist.comments.push(comment_id);
    isExist.save();
    if (!req.session.myName) {
      req.session.myName = writer;
    }
    return res
      .status(201)
      .json({ id: comment_id, isMyName: req.session.myName === writer });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const commentEdit = async (req, res) => {
  const { id, content } = req.body;
  const _id = id.split("_")[0];

  try {
    const comment = await Comment.findById(_id);
    if (!comment) {
      return res.status(409).json({ error: "커멘트가 존재하지 않습니다." });
    }

    await Comment.updateOne({ _id }, { content });
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "알수없는 에러가 발생했어요." });
  }
};

export const commentDelete = async (req, res) => {
  try {
    const { id, postId } = req.body;
    const post = await Post.exists({ _id: postId });
    if (!post) {
      return res.status(409).json({ error: "포스트가 없습니다." });
    }
    await Comment.remove({ _id: id });
    return res.sendStatus(201);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
