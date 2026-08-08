import type { Request, Response } from 'express';
import z, { success } from 'zod';
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

        if (!c) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

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

    listUserTasks = async (req: Request, res: Response ) => {

        if(!req.user){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const { id } = req.user;

        const tasks = await prisma.task.findMany({
            where: {
                userId: id
            }
        });

        return res.status(200).json({
            success: true,
            data: tasks
        });
    }

    list = async (req: Request, res: Response ) => {
        const tasks = await prisma.task.findMany();

        return res.status(200).json({
            success: true,
            data: tasks
        });
    }

    update = async (req: Request, res: Response ) => {
        const { id, title, description } = req.body;

        const task = await prisma.task.findFirst({
            where: { id }
        });

        if(!task){
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const data: {
        title?: string;
        description?: string;
        } = {};

        if (title !== undefined) {
            data.title = title;
        }

        if (description !== undefined) {
            data.description = description;
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data
        });

        return res.status(200).json({
            success: true,
            message: "Task Updated",
            data: updatedTask
        });
    }

    delete = async (req: Request, res: Response ) => {

        const { id } = req.body;

        const task = await prisma.task.findFirst({
            where: { id }
        });

        if(!task){
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        await prisma.task.delete({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "Task deleted",
        });
    }
}

export { TasksController };