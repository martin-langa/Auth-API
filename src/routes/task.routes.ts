import { Router } from "express";
import { TasksController } from "../controllers/tasks-controller.js";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.post("/create", tasksController.create);

export { tasksRoutes };