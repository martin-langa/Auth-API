import type { Request, Response } from 'express';
import z from 'zod';
import prisma from '../util/db.js';

class TasksController {

    create = async (req: Request, res: Response ) => {

        const taskSchema = z.object({
            title: z
                .string()
                .min(3, "O titulo deve conter ao menos 3 letras"),
            description: z
                .string()
                .max(250, "A descrição não pode ter mais de 250 caracteres"),
            category: z.string()
        });

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Não autenticado"
            });
        }

        const userId = req.user?.id;

        const { title, description, category } = taskSchema.parse(req.body);

        const c = await prisma.category.findFirst({
            where: {
                name: category
            }
        })

        const task = await prisma.task.create({
            data: {
                title,
                description,
                userId,
                categoryId: c.id
            }
        });

        return res.status(201).json({
            success: true,
            message: "Task criada com sucesso",
            data: task
        })
    }
}

export { TasksController };