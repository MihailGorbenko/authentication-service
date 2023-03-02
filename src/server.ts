import mongoose, { Error } from 'mongoose'
import path from 'path'
import http from 'http'
import https from 'https'
import fs from 'fs'
import config from 'config'
import Log from './utils/log'
import httpRedirect from './middleware/httpsRredirect'
import createApp from './app'
import createDatabase from './storage/db'


const log = new Log("Server")

const HTTP_PORT = config.get('http_port')
const HTTPS_PORT = config.get('https_port')


 try {
      const db = createDatabase()
      const app = createApp(db)

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



