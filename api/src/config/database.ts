import { Client, Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// PostgreSQL接続設定
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "todo_db",
  user: process.env.DB_USER || "todo_user",
  password: process.env.DB_PASSWORD || "todo_password",
});

export default pool;
