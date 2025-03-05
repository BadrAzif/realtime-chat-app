import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "user not logged in" });
    }
    let decoded;
    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
        console.error("error in verify token", error);
        return res.status(401).json({ error: "invalid token" });
    }
    const user = await User.findById(decoded.userId)
    if(!user) return res.status(401).json({ error: "user not found" });
     req.user = user
     next()
  } catch (error) {
    console.error("error in protectRoute", error);
    res.status(500).json({ error: error.message });
  }
};
