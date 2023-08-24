import { badRequestError } from "@/errors/bad-request-erros";
import { forbiddenError } from "@/errors/forbidden-error";
import handleSaveRepository, { userId } from "@/repositories/handleSave-repository";
import { cardBody } from "@/schemas/handleSave/CardSCHEMA";
import { loginBody } from "@/schemas/handleSave/LoginSCHEMA";
import { otherBody } from "@/schemas/handleSave/OtherSCHEMA";
import { decrypt, encrypt } from "@/utils/crypto";
import { savedCard, savedLogin, savedOtherNotes } from "@prisma/client";

async function verifyLogin(body: loginBody){

    const validation = {
        minLength: body.password.length >= 6,
        hasDigit: /[0-9]/.test(body.password),
        hasLowercase: /[a-z]/.test(body.password),
        hasUppercase: /[A-Z]/.test(body.password),
        hasSpecialCharacter: /[!@#$%^&*()\-+]/.test(body.password)
    }

    let cont = 0
    Object.keys(validation).forEach(key => {
        if(validation[key]) {
            cont++
        }
    });

    const levelRef = {
        0: {
            strongLevel: "fraca",
        },
        1: {
            strongLevel: "fraca",
        },
        2: {
            strongLevel: "fraca",
        },
        3: {
            strongLevel: "fraca",
        },
        4: {
            strongLevel: "fraca",
        },
        5: {
            strongLevel: "forte",
        }
    } 

    if (levelRef[cont].strongLevel !== body.passwordStrongLevel){
        throw badRequestError("Level da Senha inválido")
    }
    
    return
}
async function verifyBelongLoginItem(body: {userId: number, itemId: number}) {
    const result = await handleSaveRepository.findUniqueLoginDataById(body.itemId)
    if (result.userId !== body.userId){
        throw forbiddenError("O item não pertence ao Usuario")
    }
}
async function verifyBelongCardItem(body: {userId: number, itemId: number}) {
    const result = await handleSaveRepository.findUniqueCardDataById(body.itemId)
    if (result.userId !== body.userId){
        throw forbiddenError("O item não pertence ao Usuario")
    }
}
async function verifyBelongOtherNotesItem(body: {userId: number, itemId: number}) {
    const result = await handleSaveRepository.findUniqueOtherNotesDataById(body.itemId)
    if (result.userId !== body.userId){
        throw forbiddenError("O item não pertence ao Usuario")
    }
}
async function upsertCard(body: cardBody & userId & { itemId?: number }){
    const cryptedBody = {
        number: encrypt(body.number),            
        ownerName: body.ownerName,
        password: encrypt(body.password),
        color: body.color,
        expirationDate: body.expirationDate,
        iconName: body.iconName,
        issuer: body.issuer,
        name: body.name,
        securityCode: encrypt(body.securityCode),
        userId: body.userId
    }
    await handleSaveRepository.upsertCard(cryptedBody)
    return
}
async function upsertLogin(body: loginBody & userId & { itemId?: number }){
    const cryptedBody = {
        ...body,
        passwordStrongLevel: body.passwordStrongLevel.toLowerCase(),
        password: encrypt(body.password)
    }
    await handleSaveRepository.upsertLogin(cryptedBody)
    return
}
async function upsertOtherNotes(body: otherBody & userId & { itemId?: number }){
    await handleSaveRepository.upsertOther(body)
    return
}
async function findAllData(userId: number){
    const othersNotes = await handleSaveRepository.findAllOtherNotesData(userId)
    const cards = await handleSaveRepository.findAllCardData(userId)
    const logins = await handleSaveRepository.findAllLoginData(userId)
    const formatedArray = orderByUpdatedAt([...othersNotes, ...cards, ...logins], true)
    return formatedArray
}
async function findByFilter(body: {includesArray: string[], orderBy: string, userId: number}){
    let filteredArray = []

    if (body.includesArray.includes("card")){
        const responseCard = await handleSaveRepository.findAllCardData(body.userId)
        filteredArray = [... filteredArray, ...responseCard]
    }
    if (body.includesArray.includes("other")){
        const responseOtherNotes = await handleSaveRepository.findAllOtherNotesData(body.userId)
        filteredArray = [... filteredArray, ...responseOtherNotes]
    }
    if (body.includesArray.includes("login")){
        const responseLogin = await handleSaveRepository.findAllLoginData(body.userId)
        filteredArray = [... filteredArray, ...responseLogin]
    }
    const orderByOptions = {
        orderByUpdatedAtAsc: () => orderByUpdatedAt(filteredArray, false),
        orderByUpdatedAtDesc:  () => orderByUpdatedAt(filteredArray, true),
        orderByPasswordStrongLeverAsc:  () => orderByStrongLevel(filteredArray, false),
        orderByPasswordStrongLeverDesc: () =>  orderByStrongLevel(filteredArray, true)
    }

    const formatedArray = orderByOptions[body.orderBy]()
    return formatedArray
}
async function findUniqueByItemId(body: {type: string, userId: number, itemId: number}){
    const getUniqueData = {
        card: () => findUniqueCardDataById(body.itemId),
        login: () => findUniqueLoginDataById(body.itemId),
        other: () => findUniqueOtherNotesDataById(body.itemId)
    }
    const result = await getUniqueData[body.type]()
    return result
}
async function findUniqueCardDataById(itemId: number){
    const result = await handleSaveRepository.findUniqueCardDataById(itemId)
    const decryptedResult = {
        id: result.id,
        color: result.color,
        expirationDate: result.expirationDate,
        iconName: result.iconName,
        issuer: result.issuer,
        name: result.name,
        number: decrypt(result.number),
        ownerName: result.ownerName,
        password: decrypt(result.password),
        securityCode: decrypt(result.securityCode),
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
    }
    return decryptedResult
} 
async function findUniqueLoginDataById(itemId: number){
    const result = await handleSaveRepository.findUniqueLoginDataById(itemId)
    const decryptedResult = {
        ...result,
        password: decrypt(result.password)
    }
    return decryptedResult
} 
async function findUniqueOtherNotesDataById(itemId: number){
    const result = await handleSaveRepository.findUniqueOtherNotesDataById(itemId)
    return result
} 
function orderByUpdatedAt(arr: (savedOtherNotes | savedCard | savedLogin)[], mostRecentFirst: boolean){
    if (mostRecentFirst){
        const formatedArray = arr.sort((a, b) => {
            return b.updatedAt.getTime() - a.updatedAt.getTime();
        });
        return formatedArray
    }
    const formatedArray = arr.sort((a, b) => {
        return a.updatedAt.getTime() - b.updatedAt.getTime(); 
    });
    return formatedArray
}
function getStrongLevelScore(item: savedOtherNotes | savedCard | savedLogin): number {
    const StrongLevelScore = {
        fraca: 1,
        media: 2,
        forte: 3,
        semSenha: 0
    };
    if ('passwordStrongLevel' in item) {
        console.log(item, StrongLevelScore[item.passwordStrongLevel])
        return StrongLevelScore[item.passwordStrongLevel];
    } else {
        console.log(item, StrongLevelScore.semSenha)
        return StrongLevelScore.semSenha;
    }
}
function orderByStrongLevel(arr: (savedOtherNotes | savedCard | savedLogin)[], mostRatedFirst: boolean){
    const sortedArray = [...arr].sort((a, b) => {
        return mostRatedFirst 
            ? getStrongLevelScore(a) - getStrongLevelScore(b) 
            : getStrongLevelScore(b) - getStrongLevelScore(a);
    });
    return sortedArray;
}
async function deleteItem(body: {type: string, itemId: number}){
    if (body.type === "card"){
        return await handleSaveRepository.deleteUniqueCardById(body.itemId)        
    }
    if (body.type === "login"){
        return await handleSaveRepository.deleteUniqueLoginById(body.itemId)
    }
    if (body.type === "other"){
        return await handleSaveRepository.deleteUniqueOtherNotesById(body.itemId)
    }
}

const handlSaveService = {
    verifyLogin,
    upsertLogin,
    upsertCard,
    upsertOtherNotes,
    findAllData,
    findByFilter,
    findUniqueByItemId,
    verifyBelongLoginItem,
    verifyBelongCardItem,
    verifyBelongOtherNotesItem,
    deleteItem
}

export default handlSaveService