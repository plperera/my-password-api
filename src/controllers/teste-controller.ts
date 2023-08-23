import authService from "@/services/auth-service/auth-service";
import { decrypt, encrypt } from "@/utils/crypto";
import { Request, Response } from "express";
import httpStatus from "http-status";

let db: any = []


export async function InsertValue(req: Request, res: Response) {
    try {

        const {teste} = req.body

        const testeEncrypt = encrypt(teste)

        db.push({value: teste, encrypt: testeEncrypt, return: ''}) 
        return res.sendStatus(httpStatus.CREATED)
        

    } catch (error) {
        console.log(error)
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}
export async function GetValue(req: Request, res: Response) {
    try {

        const teste = db[0]

        teste["return"] = decrypt(teste.encrypt)

        return res.send(teste).status(httpStatus.OK)
        

    } catch (error) {
        console.log(error)
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

