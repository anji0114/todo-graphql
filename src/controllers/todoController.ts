import pool from "../config/database";
import { Todo } from "../types/todo";
import { Request, Response } from "express";

export const getAllTodos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM todos");
    const todos: Todo[] = result.rows;

    res.json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get todos",
    });
  }
};

export const getTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
    const todo: Todo = result.rows[0];

    if (!todo) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      });
      return;
    }

    res.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get todo",
    });
  }
};

export const createTodo = async () => {};
