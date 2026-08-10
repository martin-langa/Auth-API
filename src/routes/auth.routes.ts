import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller.js';
import { authenticated } from '../middlewares/authentication.js';

const authRoutes = Router();

const authController = new AuthController();

authRoutes.post("/signup", authController.signUp);
authRoutes.post("/signin", authController.signIn);
authRoutes.post("/me", authenticated, authController.whoAmI);

export { authRoutes };