import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

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
  console.log("1. リクエスト受信");

  // これは即座に実行される（同期処理）
  const message = "Hello World!";

  console.log("2. レスポンス送信");
  res.json({ message });

  console.log("3. 次のリクエストを待機");
});

// ヘルスチェック用
app.get("/health", (req, res) => {
  res.json({ status: "OKk", timestamp: new Date().toISOString() });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
