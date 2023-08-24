import { deleteByItemId, getAllData, getAllDataByFilter, getDataByItemId, saveItem, updateItem } from '@/controllers/handleSave-controller'
import { authenticateToken } from '@/middlewares/authentication-middlerare'
import { Router } from 'express'

const handleSaveRouter = Router()

handleSaveRouter
    .all("/*", authenticateToken)
    .get("", getAllData)
    .get("", getAllDataByFilter)
    .get("/unique", getDataByItemId)
    .post("", saveItem)
    .put("", updateItem)
    .delete("", deleteByItemId)
export { handleSaveRouter }