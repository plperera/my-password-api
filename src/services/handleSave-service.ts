import { badRequestError } from "@/errors/bad-request-erros";
import handleSaveRepository, { userId } from "@/repositories/handleSave-repository";
import { cardBody } from "@/schemas/handleSave/CardSCHEMA";
import { loginBody } from "@/schemas/handleSave/LoginSCHEMA";
import { otherBody } from "@/schemas/handleSave/OtherSCHEMA";
import { encrypt } from "@/utils/crypto";
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
            strongLevel: "Fraca",
        },
        1: {
            strongLevel: "Fraca",
        },
        2: {
            strongLevel: "Fraca",
        },
        3: {
            strongLevel: "Fraca",
        },
        4: {
            strongLevel: "Fraca",
        },
        5: {
            strongLevel: "FORTE",
        }
    } 

    if (levelRef[cont] === body.passwordStrongLevel){
        throw badRequestError("Level da Senha inválido")
    }
    
    return
}
async function insertCard(body: cardBody & userId){
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
    await handleSaveRepository.createCard(cryptedBody)
    return
}
async function insertLogin(body: loginBody & userId){
    const cryptedBody = {
        ...body,
        password: encrypt(body.password)
    }
    await handleSaveRepository.createLogin(cryptedBody)
    return
}
async function insertOtherNotes(body: otherBody & userId){
    await handleSaveRepository.createOther(body)
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
        orderByUpdatedAtAsc: orderByUpdatedAt(filteredArray, false),
        orderByUpdatedAtDesc: orderByUpdatedAt(filteredArray, true),
        orderByPasswordStrongLeverAsc: orderByStrongLevel(filteredArray, false),
        orderByPasswordStrongLeverDesc: orderByStrongLevel(filteredArray, true)
    }

    const formatedArray = orderByOptions[body.orderBy]
    return formatedArray
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
        return StrongLevelScore[item.passwordStrongLevel];
    } else {
        return StrongLevelScore.semSenha;
    }
}
function orderByStrongLevel(arr: (savedOtherNotes | savedCard | savedLogin)[], mostRatedFirst: boolean){
    if (mostRatedFirst){
        const formatedArray = arr.sort((a, b) => {
            return getStrongLevelScore(b) - getStrongLevelScore(a);
        });
        return formatedArray
    }
    const formatedArray = arr.sort((a, b) => {
        return getStrongLevelScore(a) - getStrongLevelScore(b);
    });
    return formatedArray
}
const handlSaveService = {
    verifyLogin,
    insertLogin,
    insertCard,
    insertOtherNotes,
    findAllData,
    findByFilter
}

export default handlSaveService