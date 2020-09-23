import express from 'express'
import { ValidationError } from 'joi'
import { Response, Request, NextFunction } from 'express'
import util from 'util'

type Middleware = (error: any, req: Request, res: Response, next: NextFunction) => void

export const JoiError: Middleware = (error, req, res, next) => {
    if (!(error instanceof ValidationError)) {
        return next(error)
    }

    res.status(400).json({
        type: 'JoiError',
        message: error.details[0].message,
    })
}

export const firebaseError: Middleware = (error, req, res, next) => {
    console.log('firebase', util.inspect(error, { showHidden: true, depth: null }))
}
