"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const resetPasswordToken = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: 'ServiceUser', required: true },
    token: { type: String, required: true, unique: true },
    clientUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 }
});
exports.default = (0, mongoose_1.model)('ResetPasswordToken', resetPasswordToken);
