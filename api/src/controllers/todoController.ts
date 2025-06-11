import pool from "../config/database";
import { Todo } from "../types/todo";
import { Request, Response } from "express";
import { handle500Error } from "../libs/handleError";

export const getAllTodos = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY updated_at DESC");
    const todos: Todo[] = result.rows;

    res.json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    handle500Error(res, error, "Failed to get todos");
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
    handle500Error(res, error, "Failed to get todo");
  }
};

export const createTodo = async (
  req: Request<{}, {}, { title: string }>,
  res: Response
): Promise<void> => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
      return;
    }

    const result = await pool.query(
      "INSERT INTO todos (title, completed, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, false, new Date(), new Date()]
    );
    const todo: Todo = result.rows[0];

    res.status(201).json({
      success: true,
      data: todo,
      message: "Todo created successfully",
    });
  } catch (error) {
    handle500Error(res, error, "Failed to create todo");
  }
};

export const updateTodo = async (
  req: Request<{ id: string }, {}, { title?: string; completed?: boolean }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Check if todo exists
    const checkResult = await pool.query("SELECT * FROM todos WHERE id = $1", [
      id,
    ]);
    
    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      });
      return;
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (completed !== undefined) {
      updates.push(`completed = $${paramCount}`);
      values.push(completed);
      paramCount++;
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        message: "No fields to update",
      });
      return;
    }

    // Add updated_at
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    paramCount++;

    // Add id as the last parameter
    values.push(id);

    const query = `UPDATE todos SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    const todo: Todo = result.rows[0];

    res.json({
      success: true,
      data: todo,
      message: "Todo updated successfully",
    });
  } catch (error) {
    handle500Error(res, error, "Failed to update todo");
  }
};

export const deleteTodo = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if todo exists
    const checkResult = await pool.query("SELECT * FROM todos WHERE id = $1", [
      id,
    ]);

    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
      });
      return;
    }

    // Delete the todo
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    handle500Error(res, error, "Failed to delete todo");
  }
};

