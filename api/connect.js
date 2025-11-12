import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Promise-based connection test
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("Connected to AWS RDS MySQL successfully!");
    conn.release();
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();
