import joi from "joi"

export type updateOtherBody = {
    itemId: number,
    name: string,
    text: string,
    iconName: string,
    color: string,
}

const updateOtherSCHEMA = joi.object<updateOtherBody>({
    itemId: joi.number().required(),
    name: joi.string().required().min(2),
    text: joi.string().required().min(1),
    iconName: joi.string().required().min(4),
    color: joi.string().required().min(7), 
})

export {updateOtherSCHEMA}