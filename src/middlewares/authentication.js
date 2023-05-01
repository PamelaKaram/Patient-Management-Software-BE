import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const authenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  console.log(token);
  try {
    const decode = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    console.log("Decode", decode);
    req.user = decode;
    next();
  } catch (e) {
    return res.sendStatus(403);
  }
};

export default authenticated;
