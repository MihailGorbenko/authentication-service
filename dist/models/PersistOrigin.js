"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const persistOrigin = new mongoose_1.Schema({
    origin: { type: String, required: true, unique: true },
    jwtSecret: { type: String, required: true, unique: true }
});
exports.default = (0, mongoose_1.model)('PersistOrigin', persistOrigin);
