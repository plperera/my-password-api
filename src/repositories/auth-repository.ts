import { prisma } from "@/config";
import { signUpBody } from "@/schemas/auth/signupSCHEMA";

async function findUserWithEmail(email: string){
    return prisma.user.findFirst({
        where: {
            email: email
        }
    })
}
async function createUser(body: Omit<signUpBody, "passwordVerify">){
    return prisma.user.create({
        data: {
            email: body.email,
            name: body.name,
            password: body.password
        }
    })
}
async function createSession({userId, token}: {userId: number, token: string}){
    return prisma.session.create({
        data: {
            userId: userId,
            token: token
        }
    })
}
async function findSession(token: string){
    return prisma.session.findFirst({
        where: {
            token: token
        }
    })
}
async function deleteSession(userId: number){
    return prisma.session.deleteMany({
        where: {
            userId: userId
        }
    })
}
const authRepository = {
    findUserWithEmail,
    createUser,
    createSession,
    findSession,
    deleteSession
}

export default authRepository