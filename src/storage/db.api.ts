import RefreshToken from "../models/RefreshToken";
import ServiceUser, { IServiceUser } from "../models/ServiceUser";
import { RefreshTokenRecord, ServiceUserRecord } from "../types/databaseRecords";
import JWT from 'jsonwebtoken'
import config from 'config'
import bcrypt from 'bcrypt'

export abstract class DB {
    abstract addServiceUser(user: IServiceUser): Promise<String>
    abstract findUserByEmail(email: String): Promise<ServiceUserRecord>
    abstract findRefrTokenByUserId(userId: String, remove: boolean): Promise<RefreshTokenRecord>
    abstract findRefrToken(token: String, remove: boolean): Promise<RefreshTokenRecord>
    abstract createNewRefrToken(userId: string): Promise<String>
}


export default class Database extends DB {

    async findRefrToken(token: String, remove: boolean): Promise<RefreshTokenRecord> {
        const refreshToken = await RefreshToken.findOne({ token })
        if (refreshToken && remove) await refreshToken.deleteOne()
        return refreshToken
    }

    async createNewRefrToken(userId: String): Promise<string> {

        const token = JWT.sign({}, config.get("jwtSecret"), {});
        const RTRecord = new RefreshToken({ token, userId });
        await RTRecord.save()
        return token
    }


    async findRefrTokenByUserId(userId: String, remove: boolean = false): Promise<RefreshTokenRecord> {

        const oldRefreshToken = await RefreshToken.findOne({ userId })
        if (oldRefreshToken && remove) await oldRefreshToken.deleteOne()
        return oldRefreshToken
    }


    async findUserByEmail(email: String): Promise<ServiceUserRecord> {
        const user = await ServiceUser.findOne({ email }).exec()
        return user
    }

    async addServiceUser(user: IServiceUser):Promise<String> {

        const hashPswd = bcrypt.hashSync(user.password.toString(), config.get("passwordSalt"));
        const serviceUser = new ServiceUser({ email: user.email, password: hashPswd })
        const saved = await serviceUser.save()
        return saved.id
    }

}