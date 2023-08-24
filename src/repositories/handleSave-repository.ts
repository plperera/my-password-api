import { prisma } from "@/config";
import { signUpBody } from "@/schemas/auth/signupSCHEMA";
import { cardBody } from "@/schemas/handleSave/CardSCHEMA";
import { loginBody } from "@/schemas/handleSave/LoginSCHEMA";
import { otherBody } from "@/schemas/handleSave/OtherSCHEMA";
import { updateCardBody } from "@/schemas/handleSave/UpdateCardSCHEMA";
import { updateLoginBody } from "@/schemas/handleSave/UpdateLoginSCHEMA";

export type userId = {
    userId: number
}

async function upsertLogin(body: loginBody & userId & { itemId?: number }) {
    return prisma.savedLogin.upsert({
        where: {
            id: body.itemId || -1,        
        },
        update: {
            ref: body.ref,
            email: body.email,
            password: body.password,
            passwordStrongLevel: body.passwordStrongLevel,
            iconName: body.iconName,
            color: body.color
        },
        create: {
            userId: body.userId,            
            name: body.name,
            ref: body.ref,
            email: body.email,
            password: body.password,
            passwordStrongLevel: body.passwordStrongLevel,
            iconName: body.iconName,
            color: body.color
        }
    });
}
async function upsertCard(body: cardBody & userId & { itemId?: number }) {
    return prisma.savedCard.upsert({
        where: {
            id: body.itemId || -1, 
        },
        update: {
            number: body.number,            
            ownerName: body.ownerName,
            password: body.password,
            color: body.color,
            expirationDate: body.expirationDate,
            iconName: body.iconName,
            issuer: body.issuer,
            name: body.name,
            securityCode: body.securityCode
        },
        create: {
            userId: body.userId ,
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
    });
}
async function upsertOther(body: otherBody & userId & { itemId?: number }) {
    return prisma.savedOtherNotes.upsert({
        where: {
            id: body.itemId || -1 // Mesmo truque do id mencionado anteriormente.
        },
        update: {
            color: body.color,
            iconName: body.iconName,
            name: body.name,
            text: body.text,
        },
        create: {
            userId: body.userId,
            color: body.color,
            iconName: body.iconName,
            name: body.name,
            text: body.text            
        }
    });
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
async function findUniqueOtherNotesDataById(itemId: number){
    return prisma.savedOtherNotes.findUnique({
        where: {
            id: itemId,
        }
    })
}
async function findUniqueCardDataById(itemId: number){
    return prisma.savedCard.findUnique({
        where: {
            id: itemId,
        }
    })
}
async function findUniqueLoginDataById(itemId: number){
    return prisma.savedLogin.findUnique({
        where: {
            id: itemId,
        }
    })
}
async function deleteUniqueOtherNotesById(itemId: number){
    return prisma.savedOtherNotes.delete({
        where: {
            id: itemId,
        }
    })
}
async function deleteUniqueCardById(itemId: number){
    return prisma.savedCard.delete({
        where: {
            id: itemId,
        }
    })
}
async function deleteUniqueLoginById(itemId: number){
    return prisma.savedLogin.delete({
        where: {
            id: itemId,
        }
    })
}
const handleSaveRepository = {
    upsertLogin,
    upsertCard,
    upsertOther,
    findAllOtherNotesData,
    findAllCardData,
    findAllLoginData,
    findUniqueOtherNotesDataById,
    findUniqueCardDataById,
    findUniqueLoginDataById,
    deleteUniqueOtherNotesById,
    deleteUniqueCardById,
    deleteUniqueLoginById
}

export default handleSaveRepository