import type { Request, Response } from 'express';
import z, { success } from 'zod';
import prisma from '../util/db.js';

type Task = {
    id: string
    title: string
    description: string
    categoryName: string
    categoryId: number
    userId: string
}
class TasksController {

    create = async (req: Request, res: Response ) => {

        try{
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

            let returnData = {
                id: "",
                title,
                description,
                categoryName: "",
                categoryId: 0,
                userId,
            }
            let data = {
                title,
                description,
                userId,
                categoryId: 0,
                categoryName: ""
            }

            if (!c) {
                const ca = await prisma.category.create({
                    data: {
                        name: category
                    }
                });

                data.categoryId = ca.id
                returnData.categoryId = ca.id
                returnData.categoryName = ca.name
                data.categoryName = ca.name
            }else{
                data.categoryId = c.id;
                data.categoryName = c.name
            }

            

            const task = await prisma.task.create({
                data
            });

            returnData.id = task.id

            return res.status(201).json({
                success: true,
                message: "Task criada com sucesso",
                data: returnData
            })
        }catch(err){
            console.log("Erro no create" + err);
        }
    }

    listUserTasks = async (req: Request, res: Response ) => {

        console.log(req.user);
        
        if(!req.user){
            return res.status(401).json({
                success: false,
                message: "Error fetching"
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