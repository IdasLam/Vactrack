import admin from 'firebase-admin'
import path from 'path'

admin.initializeApp({
    credential: admin.credential.cert(path.resolve(__dirname, './serviceAccountKey.json')),
    databaseURL: 'https://vactrack-87132.firebaseio.com',
})

import express from 'express'
import auth from './routes/auth'
import * as error from './routes/middlewares/errors'
import family from './routes/family'
import cors from 'cors'

const app = express()

const isProd = process.env.NODE_ENV === 'production'

// const db = admin.firestore()

// const hej = async () => {
//     const doc = await db.collection('family').get()

//     doc.forEach((s) => {
//         console.log(s.id, '=>', s.data())
//     })
// }

// hej()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use('/api', auth)
app.use('/api', family)

app.use(error.JoiError)
app.use(error.firebaseError)

app.listen(3001)
