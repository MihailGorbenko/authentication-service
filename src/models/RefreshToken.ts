import { Schema, model, Types } from "mongoose";

export interface IRefreshToken {
    token: String
}

const refreshToken = new Schema<IRefreshToken>({
    token: { type: String, required: true, unique: true }
})

export default model('RefreshToken',refreshToken)