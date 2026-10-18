import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


export class simpleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {

        // console.log('simpleMiddleware: Olá')

        const authorization = req.headers?.authorization;

        if(authorization){
            req['user'] = {
                nome: 'Vinicius',
                sobrenome: 'amorim',
                role: 'admin',
            }
        }

        next()
        
    }
}