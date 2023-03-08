"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const register_1 = __importDefault(require("./endpoints/auth/register"));
const login_1 = __importDefault(require("./endpoints/auth/login"));
const check_email_1 = __importDefault(require("./endpoints/auth/check_email"));
const refresh_token_1 = __importDefault(require("./endpoints/auth/refresh_token"));
const reset_password_1 = __importDefault(require("./endpoints/resetPassword/reset_password"));
const reset_password_link_1 = __importDefault(require("./endpoints/resetPassword/reset_password_link"));
const set_password_1 = __importDefault(require("./endpoints/resetPassword/set_password"));
const addOrigin_1 = __importDefault(require("./endpoints/settings/addOrigin"));
const getAllowedOrigins_1 = __importDefault(require("./endpoints/settings/getAllowedOrigins"));
const serviceRouter = (0, express_1.Router)();
serviceRouter
    .use("/register", register_1.default)
    .use("/login", login_1.default)
    .use('/checkEmail', check_email_1.default)
    .use('/refreshToken', refresh_token_1.default)
    .use('/resetPassword', reset_password_1.default)
    .use('/resetPasswordLink', reset_password_link_1.default)
    .use('/setPassword', set_password_1.default)
    .use('/addOrigin', addOrigin_1.default)
    .use('/getAllowedOrigins', getAllowedOrigins_1.default)
    .get('/', (req, res) => res.sendFile(path_1.default.resolve(__dirname, '../public/index.html')));
exports.default = serviceRouter;
