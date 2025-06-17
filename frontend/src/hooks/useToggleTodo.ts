// frontend/src/hooks/useToggleTodo.ts
import { useMutation } from "@apollo/client";
import { TOGGLE_TODO, GET_TODOS, ToggleTodoData } from "@/graphql/queries";

export const useToggleTodo = () => {
  const [toggleTodo, { loading, error }] = useMutation<ToggleTodoData>(
    TOGGLE_TODO,
    {
      // 🔥 キャッシュ更新の設定
      update: (cache, { data }) => {
        if (!data?.toggleTodo) return;

        console.log("toggleTodo", data);

        // 既存のTodoリストをキャッシュから読み取り
        const existingTodos = cache.readQuery({
          query: GET_TODOS,
        });

        if (existingTodos) {
          // キャッシュ内のTodoリストを更新
          cache.writeQuery({
            query: GET_TODOS,
            data: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              todos: (existingTodos as any).todos.map((todo: any) =>
                todo.id === data.toggleTodo.id
                  ? { ...todo, completed: data.toggleTodo.completed }
                  : todo
              ),
            },
          });
        }
      },

      // エラーハンドリング
      onError: (error) => {
        console.error("Toggle failed:", error);
      },
    }
  );

  return {
    toggleTodo,
    loading,
    error,
  };
};
