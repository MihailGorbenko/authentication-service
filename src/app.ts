import config from 'config'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import mongoose, { Error } from 'mongoose'
import path from 'path'
import http from 'http'
import https from 'https'
import fs from 'fs'
import Log from './utils/log'
import http_redirect from './middleware/https-redirect'
import auth_router from './routes/auth'


const log = new Log("app")

const HTTP_PORT = config.get('http_port')
const HTTPS_PORT = config.get('https_port')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        credentials: true,
        origin: config.get('allowedOrigins')
    }
))
//app.use(http_redirect)
app.use('/', auth_router)


async function start() {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(config.get('mongoUri'))
            .then(() => log.info('Mongo DB connection successfull'))
        mongoose.connection.on('error', (err) => log.error(err))

        http.createServer(app).listen(HTTP_PORT, () => log.info(`HTTP server listening on port ${HTTP_PORT}`))

        https.createServer({
            key: fs.readFileSync(path.resolve(__dirname, 'sslcert/privkey.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'sslcert/cert.pem')),
            ca: fs.readFileSync(path.resolve(__dirname, 'sslcert/chain.pem'))
        }, app).listen(HTTPS_PORT, () => log.info(`HTTPS server listening on port ${HTTPS_PORT}`))

    } catch (e: Error | any) {
        log.error(`Server error ${e}`)
        process.exit(1)
    }
}


start()