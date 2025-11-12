import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

export const getComments = async (req, res) => {
  try {
    const query = `
      SELECT c.*, u.id as userId, name, profilePic 
      FROM comments AS c 
      JOIN users AS u ON u.id = c.userId
      WHERE c.postId = ? 
      ORDER BY c.createdAt DESC
    `;
    const [data] = await db.execute(query, [req.query.postId]);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addComment = async (req, res) => {
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
      "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?, ?, ?, ?)";
    const values = [
      req.body.desc,
      moment().format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    await db.execute(query, values);
    return res.status(200).json("Comment has been created");
  } catch (err) {
    return res.status(500).json(err);
  }
};
