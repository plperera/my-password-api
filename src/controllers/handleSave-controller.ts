import { Request, Response } from "express";
import httpStatus from "http-status";
import { signupSCHEMA } from "@/schemas/auth/signupSCHEMA";
import { signInSCHEMA } from "@/schemas/auth/signInSCHEMA";
import authService from "@/services/auth-service";
import { AuthenticatedRequest } from "@/middlewares/authentication-middlerare";
import { loginSCHEMA } from "@/schemas/handleSave/LoginSCHEMA";
import { cardSCHEMA } from "@/schemas/handleSave/CardSCHEMA";
import { otherSCHEMA } from "@/schemas/handleSave/OtherSCHEMA";
import handlSaveService from "@/services/handleSave-service";

export async function save(req: AuthenticatedRequest, res: Response){
    try {
        const typeList = {
            card: true,
            login: true,
            other: true,
        }
        const { type } = req.body

        if (!typeList[type]){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const { userId } = req

        if (type === "card"){
            const isValid = cardSCHEMA.validate(req.body, {abortEarly: false})

            if(isValid.error){
                console.log(isValid.error)
                return res.sendStatus(httpStatus.BAD_REQUEST)
            }
            await handlSaveService.insertCard({userId, ...req.body})
        }

        if (type === "login"){
            const isValid = loginSCHEMA.validate(req.body, {abortEarly: false})

            if(isValid.error){
                console.log(isValid.error)
                return res.sendStatus(httpStatus.BAD_REQUEST)
            }
            await handlSaveService.verifyLogin(req.body)
            await handlSaveService.insertLogin({userId, ...req.body})
        }

        if (type === "other"){
            const isValid = otherSCHEMA.validate(req.body, {abortEarly: false})

            if(isValid.error){
                console.log(isValid.error)
                return res.sendStatus(httpStatus.BAD_REQUEST)
            }
            await handlSaveService.insertOtherNotes({userId, ...req.body})
        }
        return res.sendStatus(httpStatus.CREATED)  

    } catch (error) {
        if(error.name === "ConflictError") {
            return res.sendStatus(httpStatus.CONFLICT);
        }
        if (error.name === "BadRequestError") {
            return res.status(httpStatus.BAD_REQUEST).send(error);
        }
        if (error.name === "ForbiddenError") {
            return res.status(httpStatus.FORBIDDEN).send(error);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}
export async function getAllData(req: AuthenticatedRequest, res: Response){
    try {
        const { userId } = req
        const result = await handlSaveService.findAllData(userId)
        return res.send(result).status(httpStatus.CREATED)  

    } catch (error) {
        if(error.name === "ConflictError") {
            return res.sendStatus(httpStatus.CONFLICT);
        }
        if (error.name === "BadRequestError") {
            return res.status(httpStatus.BAD_REQUEST).send(error);
        }
        if (error.name === "ForbiddenError") {
            return res.status(httpStatus.FORBIDDEN).send(error);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}
export async function getAllDataByFilter(req: AuthenticatedRequest, res: Response){
    try {
        const { userId } = req

        
        const { includes, orderBy } = req.query;

        if (typeof includes !== 'string' || typeof orderBy !== 'string') {
            return res.sendStatus(httpStatus.BAD_REQUEST);
        }

        const includesArray = includes.split("&")
        
        if(includesArray.filter(
            e => ((e === "card") || (e === "other") || (e === "login"))
        ).length === includesArray.length && includesArray.length !== 0) {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const orderByOptions = {
            orderByUpdatedAtAsc: true,
            orderByUpdatedAtDesc: true,
            orderByPasswordStrongLeverAsc: true,
            orderByPasswordStrongLeverDesc: true
        }

        if (!orderByOptions[orderBy]){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const result = await handlSaveService.findByFilter({includesArray, orderBy, userId})

        return res.send(result).status(httpStatus.CREATED)  

    } catch (error) {
        if(error.name === "ConflictError") {
            return res.sendStatus(httpStatus.CONFLICT);
        }
        if (error.name === "BadRequestError") {
            return res.status(httpStatus.BAD_REQUEST).send(error);
        }
        if (error.name === "ForbiddenError") {
            return res.status(httpStatus.FORBIDDEN).send(error);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}