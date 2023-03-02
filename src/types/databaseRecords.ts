import { Types, Document } from "mongoose";
import { IRefreshToken } from "../models/RefreshToken";
import { IServiceUser } from "../models/ServiceUser";

export type ServiceUserRecord = (Document<unknown, any, IServiceUser> & IServiceUser & {
    _id: Types.ObjectId;
}) | null

export type RefreshTokenRecord = (Document<unknown, any, IRefreshToken> & IRefreshToken & {
    _id: Types.ObjectId;
}) | null