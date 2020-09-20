import Joi from "joi"

export interface Credentials {
    email: string,
    password: string
}

export const userCredentials = Joi.object({
    email: Joi.string().email({ tlds: {allow: false} }).required(),
    password: Joi.string().min(1).required()
})