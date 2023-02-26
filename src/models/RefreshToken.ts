import { Schema, model, Types } from "mongoose";

export interface IRefreshToken {
    token: String,
    userId:any
}

const refreshToken = new Schema<IRefreshToken>({
    token: { type: String, required: true, unique: true },
    userId:{ type:Types.ObjectId, required: true, unique: true}
})

export default model('RefreshToken',refreshToken)