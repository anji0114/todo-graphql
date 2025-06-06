import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes";

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(helmet()); // セキュリティヘッダー
app.use(cors()); // CORS設定
app.use(express.json()); // JSON解析

// ルート
app.get("/", (req, res) => {
  const message = "Hello my Todo API!";
  res.json({ message });
});

// todo
app.use("/api/todos", todoRoutes);

// サーバー起動
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
