import { Router } from "express";
import { authenticated } from "../middlewares/authentication.js";
import { authRoutes } from "./auth.routes.js";
import { tasksRoutes } from "./task.routes.js";

const appRouter = Router();

appRouter.use("/auth", authRoutes);

appRouter.use(authenticated)
appRouter.use("/tasks", tasksRoutes);
export default appRouter;