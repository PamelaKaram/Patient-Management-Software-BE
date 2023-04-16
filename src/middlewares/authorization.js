const isAuthorized = (role) => {
  return (req, res, next) => {
    console.log(req.user);
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Not allowed");
    }
    next();
  };
};

export default isAuthorized;
