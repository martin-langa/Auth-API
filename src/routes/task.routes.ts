import { Router } from "express";
import { TasksController } from "../controllers/tasks-controller.js";
import { authorize } from "../middlewares/authorization.js";
import { AuthController } from "../controllers/auth-controller.js";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.post("/create", tasksController.create);
tasksRoutes.post("/update", tasksController.update);
tasksRoutes.get("/list/mine", tasksController.listUserTasks);

tasksRoutes.get("/list", authorize("ADMIN"), tasksController.list);
tasksRoutes.post("/delete", tasksController.delete);

export { tasksRoutes };