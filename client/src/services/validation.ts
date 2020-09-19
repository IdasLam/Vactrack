import Joi from "joi"

export const email = (inputEmail: string) => {
    const schema = Joi.string().email({ tlds: {allow: false} }).required();
    const { error } = schema.validate(inputEmail);

    return error === undefined
}

export const password = (inputPassword: string) => {
    const schema = Joi.string().min(1).required()
    const { error } = schema.validate(inputPassword);

    return error === undefined
}
