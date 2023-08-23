import { prisma } from "@/config";
import { signUpBody } from "@/schemas/auth/signupSCHEMA";
import { cardBody } from "@/schemas/handleSave/CardSCHEMA";
import { loginBody } from "@/schemas/handleSave/LoginSCHEMA";
import { otherBody } from "@/schemas/handleSave/OtherSCHEMA";

export type userId = {
    userId: number
}

async function createLogin(body: loginBody & userId){
    return prisma.savedLogin.create({
        data: {
            userId: body.userId,            
            name: body.name,
            ref: body.ref,
            email: body.email,
            password: body.password,
            passwordStrongLevel: body.passwordStrongLevel,
            iconName: body.iconName,
            color: body.color
        }
    })
}
async function createCard(body: cardBody & userId){
    return prisma.savedCard.create({
        data: {
            number: body.number,            
            ownerName: body.ownerName,
            password: body.password,
            color: body.color,
            expirationDate: body.expirationDate,
            iconName: body.iconName,
            issuer: body.issuer,
            name: body.name,
            securityCode: body.securityCode
        }
    })
}
async function createOther(body: otherBody & userId){
    return prisma.savedOtherNotes.create({
        data: {
            color: body.color,
            iconName: body.iconName,
            name: body.name,
            text: body.text,
            userId: body.userId,
        }
    })
}
async function findAllOtherNotesData(userId: number){
    return prisma.savedOtherNotes.findMany({
        where: {
            userId: userId
        }
    })
}
async function findAllCardData(userId: number){
    return prisma.savedCard.findMany({
        where: {
            userId: userId
        }
    })
}
async function findAllLoginData(userId: number){
    return prisma.savedLogin.findMany({
        where: {
            userId: userId
        }
    })
}
const handleSaveRepository = {
    createLogin,
    createCard,
    createOther,
    findAllOtherNotesData,
    findAllCardData,
    findAllLoginData
}

export default handleSaveRepository