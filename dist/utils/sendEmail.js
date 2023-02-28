"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("config"));
const log_1 = __importDefault(require("./log"));
const log = new log_1.default('SendEmail');
function sendEmail(email, subject, text, html) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: config_1.default.get('emailHost'),
                port: 587,
                secure: false,
                auth: {
                    user: config_1.default.get('emailUser'),
                    pass: config_1.default.get('emailPassword')
                }
            });
            yield transporter.sendMail({
                from: config_1.default.get('emailUser'),
                to: email,
                subject,
                text,
                html
            });
            log.info('Email sent successfully');
        }
        catch (err) {
            log.error(`Email not sent ${err === null || err === void 0 ? void 0 : err.message}`);
        }
    });
}
exports.default = sendEmail;
