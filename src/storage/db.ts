import mongoose from "mongoose"
import Log from "../utils/log"
import config from 'config'
import Database from "./db.api"

export default function createDatabase(){
    const log = new Log("Database")

    mongoose.set('strictQuery', false)
    mongoose.connect(config.get('mongoUri'))
        .then(() => log.info('Mongo DB connection successfull'))
    mongoose.connection.on('error', (err) => log.error(err))

    return new Database()
}