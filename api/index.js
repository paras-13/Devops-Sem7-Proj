// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import multer from "multer";
// import AWS from "aws-sdk";
// import multerS3 from "multer-s3";
// import userRoutes from "./routes/users.js";
// import authRoutes from "./routes/auth.js";
// import postRoutes from "./routes/posts.js";
// import commentRoutes from "./routes/comments.js";
// import likeRoutes from "./routes/likes.js";
// import relationshipRoute from "./routes/relationships.js";
// dotenv.config();
// const app = express();

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();
// // middlewares;
// app.use("/uploads", express.static("/api/upload"));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });
// app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );
// app.use(cookieParser());

// // multer
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET,
//     acl: "public-read", // gives public URL access
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `uploads/${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

// app.post("/api/upload", upload.single("file"), (req, res) => {
//   const file = req.file;
//   console.log("Uploaded file:", file);
//   res.status(200).json({ imageUrl: file.location }); // <-- this is the S3 URL
// });

// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/likes", likeRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/relationships", relationshipRoute);
// app.get("/", (req, res) => {
//   res.send("Helllo");
// });
// app.post("/api/hello", (req, res) => {
//   console.log("Triggered");
//   res.status(200).json({ message: "Yes received" });
// });
// app.listen(8800, () => {
//   console.log("API Working");
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoute from "./routes/relationships.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8800;
// AWS SDK v3 S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Multer setup for temporary memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"), false);
    }
    cb(null, true);
  },
});

// Upload route
app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `uploads/${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    // ACL: "public-read",
  };

  try {
    const parallelUpload = new Upload({
      client: s3,
      params,
    });

    const result = await parallelUpload.done();
    console.log("File uploaded successfully:", result);

    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    res.status(200).json(fileUrl);
  } catch (err) {
    console.error("S3 Upload Error:", err);
    res.status(500).json({ message: "Failed to upload to S3", error: err });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/relationships", relationshipRoute);

app.get("/", (req, res) => {
  res.send("Hello from API");
});

app.listen(PORT, () => {
  console.log("API Running on port 8800");
});
