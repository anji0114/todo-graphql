import { Router } from "express";
import { getAllTodos, getTodoById } from "../controllers/todoController";

const router = Router();

router.get("/", getAllTodos);
router.get("/:id", getTodoById);

export default router;
