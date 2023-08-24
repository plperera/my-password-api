import joi from "joi"

export type updateCardBody = {
    itemId: number,
    type: number,
    name: string,
    ownerName: string,
    number: string,
    password: string,
    securityCode: string,
    expirationDate: string,
    iconName: string,
    issuer: string,
    color: string,
}

const updateCardSCHEMA = joi.object<updateCardBody>({
    itemId: joi.number().required(),
    name: joi.string().required().min(2),
    type: joi.string().required().min(2),
    ownerName: joi.string().required().min(2),
    number: joi.string().required().length(15).regex(/^[0-9]+$/), // Exemplo para um cartão com 16 dígitos
    password: joi.string().required().min(4), // Exemplo de senha com pelo menos 4 caracteres
    securityCode: joi.string().required().length(3).regex(/^[0-9]+$/), // Exemplo para um CVV de 3 dígitos
    expirationDate: joi.string().required().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/), // Formato MM/YY
    iconName: joi.string().required().min(4),
    issuer: joi.string().required().min(3),
    color: joi.string().required().min(7), 
})

export {updateCardSCHEMA}