export const localMiddleWare = (req, res, next) => {
  res.locals.myName = req.session.myName;
  next();
};
