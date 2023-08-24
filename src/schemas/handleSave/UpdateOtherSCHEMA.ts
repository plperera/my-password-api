import joi from "joi"

export type updateOtherBody = {
    itemId: number,
    type: string,
    name: string,
    text: string,
    iconName: string,
    color: string,
}

const updateOtherSCHEMA = joi.object<updateOtherBody>({
    itemId: joi.number().required(),
    type: joi.string().required().min(2),
    name: joi.string().required().min(2),
    text: joi.string().required().min(1),
    iconName: joi.string().required().min(4),
    color: joi.string().required().min(7), 
})

export {updateOtherSCHEMA}