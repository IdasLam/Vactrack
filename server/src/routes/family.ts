import Express from 'express'
import asyncFunction from './middlewares/async'
import admin from 'firebase-admin'

const db = admin.firestore()
const router = Express.Router()

// Checks if user is in the database
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

// Create user in databse
router.post(
    '/account/create',
    asyncFunction(async (req, res) => {
        const { uid, name } = req.body

        const docRef = db.collection('family').doc(uid)

        try {
            await docRef.set({
                [name]: {
                    status: 'user',
                    vaccines: [],
                    active_vaccines: [],
                },
            })
            res.sendStatus(200)
        } catch (error) {
            res.sendStatus(400)
        }
    }),
)

export default router
