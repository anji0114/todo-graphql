import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { ApolloServer } from "apollo-server-express";

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(helmet({ contentSecurityPolicy: false })); // セキュリティヘッダー
app.use(cors()); // CORS設定
app.use(express.json()); // JSON解析

// ルート
app.get("/", (req, res) => {
  res.json({
    message: "Hello my Todo API!",
    endpoints: {
      rest: "/api/todos",
      graphql: "/graphql",
    },
  });
});

// todo
app.use("/api/todos", todoRoutes);

const startServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  // GraphQLサーバー起動
  await apolloServer.start();

  // ExpressアプリにGraphQLを統合
  apolloServer.applyMiddleware({
    app: app as any,
    path: "/graphql",
    cors: false, // 既に設定済み
  });

  app.listen(PORT, async () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 REST API: http://localhost:${PORT}/api/todos`);
    console.log(
      `🎯 GraphQL: http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `🎮 GraphQL Playground: http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
};

// サーバー起動
startServer();
