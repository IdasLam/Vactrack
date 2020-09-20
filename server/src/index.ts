import express from 'express'
import auth from './routes/auth'
import * as error from "./routes/middlewares/errors"



const app = express()

app.use(express.json());
app.use('/api', auth)


app.use(error.JoiError)

app.listen(3001)