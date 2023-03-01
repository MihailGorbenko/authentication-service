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
const express_1 = require("express");
const log_1 = __importDefault(require("../../../utils/log"));
const userRegistred_1 = __importDefault(require("../../../middleware/userRegistred"));
const responce_status_1 = require("../../responce_status");
const ResetPasswordToken_1 = __importDefault(require("../../../models/ResetPasswordToken"));
const config_1 = __importDefault(require("config"));
const sendEmail_1 = __importDefault(require("../../../utils/sendEmail"));
const resetPasswordRouter = (0, express_1.Router)();
const log = new log_1.default('Route: /resetPassword');
resetPasswordRouter.post('/', [userRegistred_1.default], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        ///// Check user
        if (!user) {
            log.info(`User not registred`);
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: "User not registred",
                predicate: "NOT_EXIST",
            });
        }
        const clientUrl = req.headers.origin;
        //// Check if token already exists
        let passwordToken = yield ResetPasswordToken_1.default.findOne({ userId: user.id });
        if (!passwordToken) {
            log.info('Reset password token not found. Generating...');
            passwordToken = yield new ResetPasswordToken_1.default({
                userId: user.id,
                token: crypto.randomUUID(),
                clientUrl
            }).save();
        }
        const link = `${config_1.default.get('baseUrl')}/resetPasswordLink/${passwordToken.token}`;
        const text = `Follow this link to reset password ${link}`;
        const html = htmlEmailTemplate.replace('$link', link);
        yield (0, sendEmail_1.default)(user.email.toString(), "Password reset", text, html);
        log.info(`Email sent to ${user.email}`);
        return res.status(responce_status_1.ResponceStatus.Success).json({ message: 'Mail sent' });
    }
    catch (e) {
        log.error(`Error ${e === null || e === void 0 ? void 0 : e.message}`);
        return res.status(responce_status_1.ResponceStatus.ServerError).json({
            message: `Server error ${e === null || e === void 0 ? void 0 : e.message}`,
        });
    }
}));
const htmlEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset password</title>
    <style type="text/css">
        body {
            text-align: center;
            background-color: rgba(128, 128, 128, 0.479);
            color: rgb(56, 56, 56);
            padding: 3% 30%;
        }
        #button{
            text-decoration: none;
            width: max-content;
            font-size: 2em;
            background-color: #198754;
            color: white;
            border: 1px solid #198754;
            border-radius: 5px;
            padding: 0.15em 2em;
            box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.411);
        }
    </style>
</head>
<body>
    

    <h1>Reset password</h1>
    <h5>Click button below to continue</h5>
    <a href="$link" id="button">Reset</a>
  
</body>
</html>`;
exports.default = resetPasswordRouter;
