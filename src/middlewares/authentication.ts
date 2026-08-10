import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../util/env.js";
import type { payloadType } from "../types/payload.js";

export function authenticated(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Token expirado"
        });
    }

    try{
        const payload = jwt.verify(token, env.SECRET_KEY) as payloadType;

        if(!payload){
            return res.status(401).json({
                success: false,
                message: "Token invalido"
            });
        }


        req.user = {
            id: payload.id,
            role: payload.role,
            email: payload.email,
            username: payload.username
        }

        next()
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "Token invalido"
        })
    }
}