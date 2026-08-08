import type { Request, Response } from "express";
import z from "zod";
import prisma from "../util/db.js";
import { hash } from "bcrypt";

class AuthController {

    signUp = async (req: Request, res: Response) => {

        try{
            const bodySchema = z.object({
                username: z.string().min(3, "Username must have 3 or more letters"),
                email: z
                    .email()
                    .includes("@")
                    .trim(),
                password: z
                    .string()
                    .min(6, "Password must be at least 6 characters long")
            });

            const { username, email, password } = bodySchema.parse(req.body);

            const isRegistered = await prisma.user.findFirst({
                where: { email }
            });

            if(isRegistered){
                return res.status(409).json({
                    success: false,
                    message: "O email já está em uso"
                });
            }

            const passwordHash = await hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    username
                }
            });


            return res.status(201).json({
                success: true,
                message: "User registered successfully"
            });
        }catch(error){
            return res.status(500).json({
                success: false,
                message: "Ocorreu um erro no modulo de registro",
                error: error
            });
        }
    }
    
    signiIn = async (req: Request, res: Response) => {

    }
}