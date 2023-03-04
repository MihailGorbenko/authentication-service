import config from 'config'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import serviceRouter from './router/appRouter'
import { DB } from './storage/db.api'
import attachDatabase from './middleware/attachDatabase'
import httpsRredirect from './middleware/httpsRredirect'




export default function createApp(db: DB) {
    const app = express()

    app.use(cors(
        {
            credentials: true,
            origin: async (origin, callback) => {
                const origins = await db.getAllowedOrigins()
                if (origins) callback(null, origins.map(orgn => orgn.name.toString()))
                else callback(null, [])
            }
        }))
    if (process.env.NODE_ENV === "production") app.use(httpsRredirect)
    app.use(express.json())
    app.use(cookieParser())
    app.use(attachDatabase(db))
    app.use('/', serviceRouter)

    return app
}

