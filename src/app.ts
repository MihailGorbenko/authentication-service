import config from 'config'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import serviceRouter from './router/appRouter'


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: config.get('allowedOrigins') }))
app.use('/',serviceRouter )

export default app

