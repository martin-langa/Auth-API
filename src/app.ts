import express from 'express';
import cookieParser from 'cookie-parser';
import appRouter from './routes/index.js';
import { authenticated } from './middlewares/authentication.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(appRouter);

export default app;