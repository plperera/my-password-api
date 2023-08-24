import joi from "joi"

export type otherBody = {
    name: string,
    text: string,
    iconName: string,
    color: string,

}

const otherSCHEMA = joi.object<otherBody & {type: number}>({
    name: joi.string().required().min(2),
    type: joi.string().required().min(1),
    text: joi.string().required().min(1),
    iconName: joi.string().required().min(4),
    color: joi.string().required().min(7), 
})

export {otherSCHEMA}