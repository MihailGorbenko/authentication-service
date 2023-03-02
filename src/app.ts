import config from 'config'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import serviceRouter from './router/appRouter'
import { DB } from './storage/db.api'
import attachDatabase from './middleware/attachDatabase'




export default function createApp(db:DB){
    const app = express()

    app.use(express.json())
    app.use(cookieParser())
    app.use(cors({ credentials: true, origin: config.get('allowedOrigins') }))
    app.use(attachDatabase(db))
    app.use('/',serviceRouter )

    return app
}

