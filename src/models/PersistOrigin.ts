import { model, Schema } from "mongoose";


const persistOrigin = new Schema({
    origin: { type: String, required: true, unique: true }
})

export default model('PersistOrigin', persistOrigin)