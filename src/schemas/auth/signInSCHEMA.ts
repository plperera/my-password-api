import joi from "joi"

export type signInBody = {
    email: string,
    password: string,
}

const signInSCHEMA = joi.object<signInBody>({

    email: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$')),
    password: joi.string().required().min(5)

})

export {signInSCHEMA}