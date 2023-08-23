import { getAllData, getAllDataByFilter, save } from '@/controllers/handleSave-controller'
import { authenticateToken } from '@/middlewares/authentication-middlerare'
import { Router } from 'express'

const handleSaveRouter = Router()

handleSaveRouter
    .all("/*", authenticateToken)
    .get("", getAllData)
    .get("", getAllDataByFilter)
    .post("", save)
    .put("", )
    .delete("", )
export { handleSaveRouter }