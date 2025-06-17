// frontend/src/app/page.tsx
"use client";
import { useQuery } from "@apollo/client";
import { GET_TODOS, GetTodosData } from "@/graphql/queries";
import { useToggleTodo } from "@/hooks/useToggleTodo";

export default function Home() {
  // useQueryフックでGraphQLクエリを実行
  const { loading, error, data } = useQuery<GetTodosData>(GET_TODOS);
  const { toggleTodo, loading: toggleLoading } = useToggleTodo();

  // ローディング中の表示
  if (loading) return <p>読み込み中...</p>;

  // エラー時の表示
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo リスト</h1>

      <div className="space-y-2">
        {data?.todos.map((todo) => (
          <div key={todo.id} className="border p-4 rounded flex items-center">
            <div className="flex-1">
              <h3
                className={`text-lg ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.title}
              </h3>
              <p className="text-sm text-gray-600">
                状態: {todo.completed ? "完了" : "未完了"}
              </p>
              <p className="text-xs text-gray-400">
                作成日: {new Date(todo.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              className={`cursor-pointer p-2 ${
                todo.completed
                  ? "bg-gray-200 border"
                  : "border border-blue-500 text-blue-500"
              }`}
              onClick={() => toggleTodo({ variables: { id: todo.id } })}
              disabled={toggleLoading}
            >
              {todo.completed ? "未完了にする" : "完了にする"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
