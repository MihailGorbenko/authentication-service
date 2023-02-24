import { Schema, model, Types } from 'mongoose'

export interface IServiceUser {
    email: String,
    password: String
}

const serviceUser = new Schema<IServiceUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})


export default model('ServiceUser', serviceUser)