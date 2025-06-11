import pool from "../config/database";
import { Todo } from "../types/todo";

export const resolvers = {
  Query: {
    // 全てのTodoを取得
    todos: async (): Promise<Todo[]> => {
      const result = await pool.query(
        "SELECT * FROM todos ORDER BY created_at DESC"
      );
      console.log("fetch todos");
      return result.rows;
    },

    todo: async (_: any, { id }: { id: string }): Promise<Todo | null> => {
      const result = await pool.query(
        "SELECT * FROM todos WHERE id = $1",
        [id]
      );
      console.log("fetch todo");
      return result.rows[0];
    },
  },
};
