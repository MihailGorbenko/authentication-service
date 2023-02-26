"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_1 = __importDefault(require("./endpoints/register"));
const login_1 = __importDefault(require("./endpoints/login"));
const check_email_1 = __importDefault(require("./endpoints/check_email"));
const serviceRouter = (0, express_1.Router)();
serviceRouter
    .use("/register", register_1.default)
    .use("/login", login_1.default)
    .use('/checkEmail', check_email_1.default);
exports.default = serviceRouter;
