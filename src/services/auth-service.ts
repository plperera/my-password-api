import httpStatus from "http-status"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { signUpBody } from "@/schemas/auth/signupSCHEMA"
import { unauthorizedError } from "@/errors/unauthorized-error"
import { badRequestError } from "@/errors/bad-request-erros";
import { conflictError } from "@/errors/conflict-error";
import { notFoundError } from "@/errors/not-found-error";
import { signInBody } from "@/schemas/auth/signInSCHEMA";
import authRepository from "@/repositories/auth-repository";

async function verifyUser(body: signUpBody){
    if (body.password !== body.passwordVerify){
        throw badRequestError("Senhas diferentes")
    }
    const hasUser = await authRepository.findUserWithEmail(body.email)
    
    if(hasUser){
        throw conflictError("Email ja cadastrado")
    }   
    return
}
async function createNewUser(body: Omit<signUpBody, "passwordVerify">){
    const newUser = await authRepository.createUser({
        email: body.email, 
        name:body.name, 
        password:bcrypt.hashSync(body.password, 10)
    })    
    return newUser
}
async function verifyAccees(body: signInBody){
    const hasUser = await authRepository.findUserWithEmail(body.email)

    if(!hasUser){
        throw badRequestError("Email não encontrado")
    }  
        
    const isValidPassword = bcrypt.compareSync(body.password, hasUser.password)

    if(!isValidPassword){
        throw unauthorizedError("Senha invalida")
    }
    return { userId: hasUser.id, email: hasUser.email, name: hasUser.name }
}
async function createSession(userId: number){
    const token = jwt.sign({ userId }, process.env.JWT_SECRET)

    const session = await authRepository.createSession({userId, token})
    
    return session.token
}
async function deleteSession(userId: number){
    await authRepository.deleteSession( userId )
    return 
}

const authService = {
    verifyUser,
    createNewUser,
    verifyAccees,
    createSession,
    deleteSession
}

export default authService