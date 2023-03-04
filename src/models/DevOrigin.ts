import { model, Schema } from "mongoose";


const devOrigin = new Schema({
    origin: { type: String, unique: true, required: true },
    addedAt: { type: Date, default: Date.now, expires: 86400 }
})

export default model('DevOrigin', devOrigin)