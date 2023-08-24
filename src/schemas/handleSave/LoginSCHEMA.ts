import joi from "joi"

export type loginBody = {
    name: string,
    ref: string,
    email: string,
    password: string,
    passwordStrongLevel: string,
    iconName: string,
    color: string,
    type: string
}

const loginSCHEMA = joi.object<loginBody>({
    name: joi.string().required().min(2),
    type: joi.string().required().min(1),
    ref: joi.string().optional(),
    email: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$')),
    password: joi.string().required().min(1),
    passwordStrongLevel: joi.string().required().min(4),
    iconName: joi.string().required().min(4),
    color: joi.string().required().min(7), 
})

export {loginSCHEMA}