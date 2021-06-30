import Recomment from "../model/reComment";
import Comment from "../model/comment";

export const recommentAdd = async (req, res) => {
  try {
    const { id, content, writer } = req.body;
    console.log(id, content, writer);

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.sendStatus(404);
    }

    const recomment = await Recomment.create({
      ...req.body,
      comment: comment._id,
    });
    comment.reComments.push(recomment._id);
    comment.save();
  } catch (e) {
    console.log(e);
    return req.sendStatus(500);
  }
};
