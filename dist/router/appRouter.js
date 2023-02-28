"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_1 = __importDefault(require("./endpoints/auth/register"));
const login_1 = __importDefault(require("./endpoints/auth/login"));
const check_email_1 = __importDefault(require("./endpoints/auth/check_email"));
const refresh_token_1 = __importDefault(require("./endpoints/auth/refresh_token"));
const reset_password_1 = __importDefault(require("./endpoints/resetPassword/reset_password"));
const reset_password_link_1 = __importDefault(require("./endpoints/resetPassword/reset_password_link"));
const serviceRouter = (0, express_1.Router)();
serviceRouter
    .use("/register", register_1.default)
    .use("/login", login_1.default)
    .use('/checkEmail', check_email_1.default)
    .use('/refreshToken', refresh_token_1.default)
    .use('/resetPassword', reset_password_1.default)
    .use('/resetPasswordLink', reset_password_link_1.default);
exports.default = serviceRouter;
