import Express from 'express'
import asyncFunction from './middlewares/async'
import admin from 'firebase-admin'

const db = admin.firestore()
const router = Express.Router()

router.post(
    '/account',
    asyncFunction(async (req, res) => {
        const { uid } = req.body
        try {
            // const doc = await db.collection('family').get()
            await db.collection('family').doc(uid).get()
            res.sendStatus(200)
        } catch (error) {
            res.sendStatus(404)
        }
    }),
)

export default router
