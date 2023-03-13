"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const devOrigin = new mongoose_1.Schema({
    origin: { type: String, unique: true, required: true },
    jwtSecret: { type: String, required: true, unique: true },
    addedAt: { type: Date, default: Date.now, expires: 86400 }
});
exports.default = (0, mongoose_1.model)('DevOrigin', devOrigin);
