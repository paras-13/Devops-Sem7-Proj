import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

export const getPosts = async (req, res) => {
  try {
    const userId =
      !req.query.userId ||
      req.query.userId === "undefined" ||
      req.query.userId === "null"
        ? null
        : req.query.userId;

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    // Verify token synchronously inside try/catch
    let userInfo;
    try {
      userInfo = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(403).json("Token is not valid");
    }

    const query = userId
      ? `SELECT p.*, u.id as userId, name, profilePic 
      FROM posts AS p 
      JOIN users AS u ON (u.id = p.userId) 
      WHERE p.userId = ? ORDER BY p.createdAt DESC`
      : `
      SELECT p.*, u.id as userId, name, profilePic 
      FROM posts AS p 
      JOIN users AS u ON (u.id = p.userId)
      LEFT JOIN relationships AS r ON p.userId = r.followedUserId 
      WHERE r.followerUserId = ? OR p.userId = ? 
      ORDER BY p.createdAt DESC
    `;

    const values = userId ? [userId] : [userInfo.id, userInfo.id];
    const [data] = await db.execute(query, values);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addPost = async (req, res) => {
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
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?, ?, ?, ?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment().format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    await db.execute(query, values);
    return res.status(200).json("Post has been created");
  } catch (err) {
    return res.status(500).json(err);
  }
};
