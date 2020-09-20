import {Response, Request, NextFunction} from 'express'

type CallbackFunction = (req: Request, res: Response) => Promise<void>

export default (callback: CallbackFunction) => (req: Request, res: Response, next: NextFunction) => {
    callback(req, res).catch(next)
}