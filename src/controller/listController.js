import Post from "../model/post";

export const getList = (req, res) => {
  res.render("layouts/list", {
    page: "List",
    title: "글목록",
  });
};

export const getListApi = async (req, res) => {
  try {
    const posts = await Post.find().sort({
      createdAt: -1,
    });
    return res.json({ posts });
  } catch (e) {
    console.log(e);
    return res.sendStatus(404);
  }
};

export const search = async (req, res) => {
  try {
    const dateObj = new Date();
    const year = String(dateObj.getFullYear());
    const month = String(
      dateObj.getMonth().length === 2
        ? Number(dateObj.getMonth()) + 1
        : "0" + String(Number(dateObj.getMonth()) + 1)
    );
    const day = String(dateObj.getDate());
    const limit = 5;
    const skip = 0 * 5;
    const { term, date, searchSelect } = req.query;
    const reg = term.trim().length ? new RegExp(term, "i") : "";
    let posts;
    let count;
    switch (searchSelect) {
      case "date":
        const start = new Date(
          `${date || `${year}-${month}-${day}`}T00:00:00.000Z`
        );
        const end = new Date(
          `${date || `${year}-${month}-${day}`}T23:59:59.999Z`
        );
        posts = await Post.find({ createdAt: { $gte: start, $lt: end } })
          .limit(limit)
          .skip(skip)
          .sort({ createdAt: -1 });
        count = await Post.count({ createdAt: { $gte: start, $lt: end } });

        break;
      case "writer":
        posts = await Post.find({ writer: { $regex: reg } })
          .sort({
            createdAt: -1,
          })
          .limit(limit)
          .skip(skip);
        count = await Post.count({ writer: { $regex: reg } });

        break;
      case "title":
        posts = await Post.find({ title: { $regex: reg } })
          .sort({
            createdAt: -1,
          })
          .limit(limit)
          .skip(skip);
        count = await Post.count({ title: { $regex: reg } });
        break;
    }
    res.json({ posts, count });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
export const getSort = async (req, res) => {
  try {
    const { page: pageNum = 0 } = req.query;
    const limit = 5;
    const skip = pageNum * 5;
    const count = await Post.count({});
    const post = await Post.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    return res.status(201).json({ posts: post, count, curPage: pageNum });
  } catch (e) {
    console.log(e);
    return res.status(409).json({ msg: "알수없는 에러 발생" });
  }
};
