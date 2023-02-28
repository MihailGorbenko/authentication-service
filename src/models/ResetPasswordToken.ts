import { Schema, model, Types } from 'mongoose'


export interface IResetPasswordToken {
    userId: Object
    token: String
    createdAt: {
        type: DateConstructor;
        default: () => number;
        expires: number;
    }
    clientUrl: String
}

const resetPasswordToken = new Schema<IResetPasswordToken>({
    userId: { type: Types.ObjectId, ref: 'ServiceUser', required: true },
    token: { type: String, required: true, unique: true },
    clientUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 }
})


export default model('ResetPasswordToken', resetPasswordToken)