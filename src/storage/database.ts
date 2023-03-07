import RefreshToken from "../models/RefreshToken";
import ServiceUser, { IServiceUser } from "../models/ServiceUser";
import { RefreshTokenRecord, RPTokenRecord, ServiceUserRecord } from "../types/databaseRecords";
import JWT from 'jsonwebtoken'
import config from 'config'
import bcrypt from 'bcrypt'
import ResetPasswordToken from "../models/ResetPasswordToken";
import DevOrigin from "../models/DevOrigin";
import PersistOrigin from "../models/PersistOrigin";
import { Origin } from "../types/origin";
import Log from "../utils/log";
import mongoose from "mongoose";

export abstract class DB {
    abstract addServiceUser(user: IServiceUser): Promise<String>
    abstract findUserByEmail(email: String): Promise<ServiceUserRecord>
    abstract findUserById(userId: Object): Promise<ServiceUserRecord>
    abstract findRefrTokenByUserId(userId: String, remove: boolean): Promise<RefreshTokenRecord>
    abstract findRefrToken(token: String, remove: boolean): Promise<RefreshTokenRecord>
    abstract createNewRefrToken(userId: string): Promise<String>
    abstract findRPTokenByUserId(userId: String, remove: boolean): Promise<RPTokenRecord>
    abstract findRPToken(token: String, remove: boolean): Promise<RPTokenRecord>
    abstract createNewRPToken(userId: string, clientUrl: String): Promise<RPTokenRecord>
    abstract addAllowedOrigin(origin: String, dev: boolean): Promise<boolean>
    abstract getAllowedOrigins(): Promise<Origin[]>
    abstract close():Promise<void>
    abstract connect():Promise<void>
}


export default class Database extends DB {
    connection: mongoose.Connection | null;

    constructor() {
        super()
        this.connection = null
    }
    async connect():Promise<void>{
        const log = new Log("Database")

        mongoose.set('strictQuery', false)
        mongoose.connection.on('error', (err) => log.error(err))
        await mongoose.connect(config.get('mongoUri'))
        log.info('Mongo DB connection successfull')
        
        this.connection = mongoose.connection
    }


    async close():Promise<void> {
        if (this.connection){
            await this.connection.close()
            this.connection = null
        }
       
    }

    async addAllowedOrigin(origin: String, dev: boolean): Promise<boolean> {

        const newOrigin = dev
            ?
            new DevOrigin({ origin })
            :
            new PersistOrigin({ origin })

        const savedOrigin = await newOrigin.save()

        return savedOrigin ? true : false
    }

    async getAllowedOrigins(): Promise<Origin[]> {
        const origins: Origin[] = []
        const persistOrigins = await PersistOrigin.find()
        const devOrigins = await DevOrigin.find()
        if (devOrigins)
            devOrigins.forEach((doc) => { origins.push({ name: doc.origin, dev: true }) })
        if (persistOrigins)
            persistOrigins.forEach((doc) => { origins.push({ name: doc.origin, dev: false }) })

        return origins
    }

    async findUserById(userId: Object): Promise<ServiceUserRecord> {
        const user = await ServiceUser.findOne(userId)
        return user
    }

    async findRPTokenByUserId(userId: String, remove: boolean): Promise<RPTokenRecord> {
        let RPToken = remove
            ?
            await ResetPasswordToken.findOneAndDelete({ userId })
            :
            await ResetPasswordToken.findOne({ userId })

        return RPToken
    }

    async findRPToken(token: String, remove: boolean): Promise<RPTokenRecord> {
        let RPToken = remove
            ?
            await ResetPasswordToken.findOneAndDelete({ token })
            :
            await ResetPasswordToken.findOne({ token })

        return RPToken
    }

    async createNewRPToken(userId: string, clientUrl: String): Promise<RPTokenRecord> {
        const RPToken = await new ResetPasswordToken({
            userId,
            token: crypto.randomUUID(),
            clientUrl
        }).save()
        return RPToken
    }

    async findRefrToken(token: String, remove?: boolean): Promise<RefreshTokenRecord> {
        const refreshToken = remove
            ?
            await RefreshToken.findOneAndDelete({ token })
            :
            await RefreshToken.findOne({ token })

        return refreshToken
    }

    async createNewRefrToken(userId: String): Promise<string> {

        const token = JWT.sign({}, config.get("jwtSecret"), {});
        const RTRecord = new RefreshToken({ token, userId });
        await RTRecord.save()
        return token
    }


    async findRefrTokenByUserId(userId: String, remove: boolean): Promise<RefreshTokenRecord> {

        const oldRefreshToken = remove
            ?
            await RefreshToken.findOneAndDelete({ userId })
            :
            await RefreshToken.findOne({ userId })

        return oldRefreshToken
    }


    async findUserByEmail(email: String): Promise<ServiceUserRecord> {
        const user = await ServiceUser.findOne({ email }).exec()
        return user
    }

    async addServiceUser(user: IServiceUser): Promise<String> {

        const hashPswd = bcrypt.hashSync(user.password.toString(), config.get("passwordSalt"));
        const serviceUser = new ServiceUser({ email: user.email, password: hashPswd })
        const saved = await serviceUser.save()
        return saved.id
    }

}