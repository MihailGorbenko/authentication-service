import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import serviceRouter from './router/appRouter'
import { DB } from './storage/database'
import attachDatabase from './middleware/attachDatabase'
import path from 'path'

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

    app.use(express.json())
    app.use(cookieParser())
    app.use(attachDatabase(db))
    app.use('/', serviceRouter)
    app.use(express.static(path.resolve(__dirname, './public')))
    app.get("/:universalURL", (req, res) => {
        res.send("404 URL NOT FOUND");
    })

    return app
}

