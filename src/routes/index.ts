import { Router } from "express";
import { authenticated } from "../middlewares/authentication.js";
import { authRoutes } from "./auth.routes.js";
import { tasksRoutes } from "./task.routes.js";
import { authorize } from "../middlewares/authorization.js";

const appRouter = Router();

appRouter.use("/auth", authRoutes);

appRouter.use(authenticated)
appRouter.use("/tasks", authorize("USER"), tasksRoutes);
export default appRouter;