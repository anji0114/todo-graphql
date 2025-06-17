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
      const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
        id,
      ]);
      console.log("fetch todo");
      return result.rows[0];
    },
  },

  Mutation: {
    // Todo完了状態をトグル
    toggleTodo: async (_: any, { id }: { id: string }): Promise<Todo> => {
      // 現在の状態を取得
      const currentResult = await pool.query(
        "SELECT * FROM todos WHERE id = $1",
        [id]
      );

      if (currentResult.rows.length === 0) {
        throw new Error("Todo not found");
      }

      const currentTodo = currentResult.rows[0];
      const newCompletedStatus = !currentTodo.completed;

      // completed状態を更新
      const updateResult = await pool.query(
        "UPDATE todos SET completed = $1, updated_at = $2 WHERE id = $3 RETURNING *",
        [newCompletedStatus, new Date(), id]
      );

      console.log(`Todo ${id} toggled to ${newCompletedStatus}`);
      return updateResult.rows[0];
    },
  },
};
