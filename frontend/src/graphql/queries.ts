import { gql } from "@apollo/client";

// Todo一覧取得のクエリ
export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      completed
      created_at
    }
  }
`;

export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      id
      title
      completed
      created_at
      updated_at
    }
  }
`;

// 型定義（TypeScript用）
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetTodosData {
  todos: Todo[];
}

export interface ToggleTodoData {
  toggleTodo: Todo;
}
