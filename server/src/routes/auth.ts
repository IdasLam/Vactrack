import Express from 'express'
import { userCredentials, Credentials } from '../models/user'
import asyncFunction from './middlewares/async'

const router = Express.Router()

router.post(
    '/login/auth',
    asyncFunction(async (req, res) => {
        const value: Credentials = await userCredentials.validateAsync(req.body)

        console.log(value)

        res.send(value)
    }),
)

export default router
