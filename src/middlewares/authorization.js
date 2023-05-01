const isAuthorized = (role) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!role.includes(req.user.role)) {
      res.status(401);
      return res.send("Not allowed");
    }
    next();
  };
};

export default isAuthorized;
