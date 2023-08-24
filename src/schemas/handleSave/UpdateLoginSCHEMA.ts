import joi from "joi"

export type updateLoginBody = {
    itemId: number,
    type: string,
    name: string,
    ref: string,
    email: string,
    password: string,
    passwordStrongLevel: string,
    iconName: string,
    color: string,

}

const updateLoginSCHEMA = joi.object<updateLoginBody>({
    itemId: joi.number().required(),
    type: joi.string().required().min(2),
    name: joi.string().required().min(2),
    ref: joi.string().optional(),
    email: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$')),
    password: joi.string().required().min(1),
    passwordStrongLevel: joi.string().required().min(4),
    iconName: joi.string().required().min(4),
    color: joi.string().required().min(7), 
})

export {updateLoginSCHEMA}