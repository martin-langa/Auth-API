import type { NextFunction, Request, Response } from "express";

type Role = "USER" | "ADMIN"

export function authorize (...allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction ) => {
        if(!req.user){
            return res.status(401).json({
                success: false,
                message: "Não autenticado",
            });
        }

        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Você não tem permissão para realizar esta ação",
            });
        }

        next();
    }
}