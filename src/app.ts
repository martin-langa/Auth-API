import express from 'express';
import cookieParser from 'cookie-parser';
import appRouter from './routes/index.js';
import { authenticated } from './middlewares/authentication.js';
import prisma from './util/db.js';
import cors from 'cors';
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1",appRouter);

app.post("/", async (req, res) => {
    await prisma.category.create({
        data: {
            name: "necessary"
        }
    });

    return res.status(200).json({
        message: "ok"
    })
})

export default app;