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
import { updateLoginSCHEMA } from "@/schemas/handleSave/UpdateLoginSCHEMA";
import { updateCardSCHEMA } from "@/schemas/handleSave/UpdateCardSCHEMA";
import { updateOtherSCHEMA } from "@/schemas/handleSave/UpdateOtherSCHEMA";

export async function saveItem(req: AuthenticatedRequest, res: Response){
    try {
        const typeList = {
            card: true,
            login: true,
            other: true,
        }

        const { type } = req.body
        
        if (!typeList[type]){
            console.log(type)
            console.log("erro de tipo")
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const { userId } = req

        if (type === "card"){
            const isValid = cardSCHEMA.validate(req.body, {abortEarly: false})

            if(isValid.error){
                console.log(isValid.error)
                return res.sendStatus(httpStatus.BAD_REQUEST)
            }
            await handlSaveService.upsertCard({userId, ...req.body})
        }

        if (type === "login"){
            const isValid = loginSCHEMA.validate(req.body, {abortEarly: false})

            if(isValid.error){
                console.log(isValid.error)
                return res.sendStatus(httpStatus.BAD_REQUEST)
            }
            await handlSaveService.verifyLogin(req.body)
            await handlSaveService.upsertLogin({userId, ...req.body})
        }

        if (type === "other"){
            const isValid = otherSCHEMA.validate(req.body, {abortEarly: false})

            if(isValid.error){
                console.log(isValid.error)
                return res.sendStatus(httpStatus.BAD_REQUEST)
            }
            await handlSaveService.upsertOtherNotes({userId, ...req.body})
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
        console.log(error)
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
        
        const includesArray = includes.split("AND")//rever
        
        if(includesArray.filter(
            e => ((e === "card") || (e === "other") || (e === "login"))
        ).length === includesArray.length && includesArray.length === 0) {
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
export async function getDataByItemId(req: AuthenticatedRequest, res: Response){
    try {
        const { userId } = req
        const itemId = Number(req.query.itemId)

        if (typeof itemId !== 'number' || itemId <= 0 || Number(itemId.toFixed(0)) !== itemId){    
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const typeList = {
            card: true,
            login: true,
            other: true,
        }
        
        const type = req.query.type

        if (typeof type !== 'string'){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        if (!typeList[type]){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const result = await handlSaveService.findUniqueByItemId({type, userId, itemId})
        
        if(result.userId !== userId){
            console.log(result,userId )
            return res.sendStatus(httpStatus.FORBIDDEN)
        }

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
export async function updateItem(req: AuthenticatedRequest, res: Response){
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
            const isValid = updateCardSCHEMA.validate(req.body, {abortEarly: false})

            if(isValid.error){
                console.log(isValid.error)
                return res.sendStatus(httpStatus.BAD_REQUEST)
            }
            await handlSaveService.verifyBelongCardItem({userId: userId, itemId: req.body.itemId})
            await handlSaveService.upsertCard({userId, ...req.body})
        }

        if (type === "login"){
            const isValid = updateLoginSCHEMA.validate(req.body, {abortEarly: false})

            if(isValid.error){
                console.log(isValid.error)
                return res.sendStatus(httpStatus.BAD_REQUEST)
            }
            await handlSaveService.verifyLogin(req.body)
            await handlSaveService.verifyBelongLoginItem({userId: userId, itemId: req.body.itemId})
            await handlSaveService.upsertLogin({userId, ...req.body})
        }

        if (type === "other"){
            const isValid = updateOtherSCHEMA.validate(req.body, {abortEarly: false})

            if(isValid.error){
                console.log(isValid.error)
                return res.sendStatus(httpStatus.BAD_REQUEST)
            }
            await handlSaveService.verifyBelongOtherNotesItem({userId: userId, itemId: req.body.itemId})
            await handlSaveService.upsertOtherNotes({userId, ...req.body})
        }
        return res.sendStatus(httpStatus.OK)  

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
export async function deleteByItemId(req: AuthenticatedRequest, res: Response){
    try {
        const { userId } = req
        const { itemId } = req.body

        if (typeof itemId !== 'number' || itemId <= 0 || Number(itemId.toFixed(0)) !== itemId){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const typeList = {
            card: true,
            login: true,
            other: true,
        }
        const { type } = req.body

        if (typeof type !== 'string'){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
        console.log("!")
        if (!typeList[type]){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const result = await handlSaveService.findUniqueByItemId({type, userId, itemId})

        if(result.userId !== userId){
            return res.sendStatus(httpStatus.FORBIDDEN)
        }

        await handlSaveService.deleteItem({type, itemId})

        return res.sendStatus(httpStatus.OK)  

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