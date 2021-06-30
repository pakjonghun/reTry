import Post from "../model/post";
import bcrypt from "bcrypt";

export const getAdd = (req, res) => {
  res.render("layouts/add", {
    page: "Add",
    title: "포스팅",
  });
};

export const getPost = async (req, res) => {
  try {
    return res.render("layouts/post", {
      page: "Post",
      title: "포스트 내용",
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
};

export const getPostApi = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("comments");
    res.json({ post, isMyName: post.writer === req.session.myName });
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
};

export const getEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const writer = post.writer;
    console.log(writer);
    //수정해야함
    res.render("layouts/edit", {
      page: "Edit",
      title: "포스트 수정",
      post,
      error: 0,
    });
  } catch (e) {
    console.log(e);
  }
};

export const postEdit = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { password, title, writer, content } = req.body;
    const post = await Post.findById(_id);
    const isAuth = await bcrypt.compare(password, post.password);
    delete req.body.password;

    if (!isAuth) {
      return res.render(`layouts/edit`, {
        page: "Edit",
        title: "포스트 수정",
        post,
        error: "잘못된 비밀번호",
      });
    }
    await Post.updateOne({ _id }, { $set: { ...req.body } });
    return res.redirect(`/post/${_id}`);
  } catch (e) {
    console.log(e);
    return res.sendStatus(404);
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const { password } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(409)
        .json({ error: "해당 포스트가 존재하지 않습니다." });
    }
    const isCorrect = await bcrypt.compare(password, post.password);
    if (!isCorrect) {
      return res.status(409).json({ error: "잘못된 비밀번호입니다." });
    }
    await Post.remove({ _id: id });
    return res.redirect("/");
  } catch (e) {
    console.log(e);
    return res.status(409).json({ error: "알수없는 에러가 발생했어요." });
  }
};

export const postAdd = async (req, res) => {
  const {
    title_write: title,
    content_write: content,
    writer_write: writer,
    password_write: pass,
  } = req.body;

  try {
    for (let i in req.body) {
      if (!String(req.body[i].trim()).length) {
        return res.status(409).json({ error: "내용이 없습니다." });
      }
    }
    const password = await bcrypt.hash(pass, 10);
    await Post.create({ title, writer, content, password });
    let myName = req.session.myName;

    if (!myName) {
      req.session.myName = writer;
    }

    return res.status(201).json({ error: "글생성이 완료되었습니다." });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "알수없는 에러가 발생했했습니다." });
  }
};
