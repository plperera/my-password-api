
import { GetValue, InsertValue } from '@/controllers/teste-controller'
import { Router } from 'express'

const testeRouter = Router()

testeRouter
    .post("", InsertValue)
    .get("", GetValue)

export { testeRouter }