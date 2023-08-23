import joi from "joi"

export type authTokenBody = {
    token: string,
}

export type userIdBody = {
    userId: number,
}

const authTokenSCHEMA = joi.object<authTokenBody>({
 
    token: joi.string().required(),

})

export {authTokenSCHEMA}