import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const query = "SELECT * FROM users WHERE id = ?";
    const [data] = await db.execute(query, [userId]);

    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...info } = data[0];
    return res.status(200).json(info);
  } catch (err) {
    return res.status(500).json(err);
  }
};
export const updateUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    let userInfo;
    try {
      userInfo = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(403).json("Token is not valid");
    }
    const query =
      "UPDATE users SET `name`=?, `city`=?, `website`=?, `coverPic`=?, `profilePic`=? WHERE id=?";
    const values = [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.coverPic,
      req.body.profilePic,
      userInfo.id,
    ];
    const [data] = await db.execute(query, values);

    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    if (data.affectedRows > 0) return res.json("Updated");
    return res.status(403).json("You can update only your post");
  } catch (err) {
    return res.status(500).json(err);
  }
};
