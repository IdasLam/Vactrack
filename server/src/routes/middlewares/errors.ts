import express from 'express'
import { ValidationError } from "joi"
import {Response, Request, NextFunction} from 'express'


export const JoiError = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (!(error instanceof ValidationError)) {
        return next(error)
    }

    res.status(400).json({
        type: "JoiError",
        message: error.details[0].message
    })
}
