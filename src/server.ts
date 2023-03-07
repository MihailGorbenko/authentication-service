import mongoose, { Error } from 'mongoose'
import path from 'path'
import http from 'http'
import https from 'https'
import fs from 'fs'
import config from 'config'
import Log from './utils/log'
import createApp from './app'
import createDatabase from './storage/createDatabase'
import Database, { DB } from './storage/database'
import { Express } from 'express'


const log = new Log("Server")

const HTTP_PORT = config.get('http_port')
const HTTPS_PORT = config.get('https_port')

export function createHttpServer(app: Express): http.Server {
    return app.listen(HTTP_PORT, () => log.info(`HTTP server listening on port ${HTTP_PORT}`))
}

export function createHttpsServer(app: Express): https.Server {

    return https.createServer({
        key: fs.readFileSync(path.resolve(__dirname, 'sslcert/privkey.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'sslcert/cert.pem')),
        ca: fs.readFileSync(path.resolve(__dirname, 'sslcert/chain.pem'))
    }, app).listen(HTTPS_PORT, () => log.info(`HTTPS server listening on port ${HTTPS_PORT}`))

}

export default async function start() {
    let db:Database = await createDatabase()
    try {
        const app = createApp(db)
        createHttpServer(app)
        createHttpsServer(app)

    } catch (e: Error | any) {
        log.error(`Server error ${e}`)
        db?.close()
        process.exit(1)
    }
}





