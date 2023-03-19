import { Error } from 'mongoose'
import http from 'http'
import config from 'config'
import Log from './utils/log'
import createApp from './app'
import createDatabase from './storage/createDatabase'
import { DB } from './storage/database'
import { Express } from 'express'


const log = new Log("Server")
const HTTP_PORT = config.get('http_port')

export function createHttpServer(app: Express): http.Server {
    return app.listen(HTTP_PORT, () => log.info(`HTTP server listening on port ${HTTP_PORT}`))
}

export default async function start() {
    let db: DB | null = null
    try {
        db = await createDatabase()
        const app = createApp(db)
        createHttpServer(app)

    } catch (e: Error | any) {
        log.error(`Server error ${e}`)
        db?.close()
        process.exit(1)
    }
}





