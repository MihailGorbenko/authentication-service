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
const responce_status_1 = require("../../../types/responce_status");
const log_1 = __importDefault(require("../../../utils/log"));
const log = new log_1.default('Route: /resetPasswordLink');
const config_1 = __importDefault(require("config"));
const resetPasswordLinkRouter = (0, express_1.Router)();
resetPasswordLinkRouter.get('/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const database = req.database;
        const resetPasswordRecord = yield database.findRPToken(token, false);
        if (!resetPasswordRecord) {
            log.info('Reset token not found');
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: 'Reset token incorect or expired',
                predicate: 'TOKEN_EXP'
            });
        }
        log.info('Token found');
        const redirectUrl = resetPasswordRecord.clientUrl.toString() +
            config_1.default.get('resetPasswordClientUrl') +
            '/' +
            token;
        return res.redirect(redirectUrl);
    }
    catch (e) {
        log.error(`Error ${e === null || e === void 0 ? void 0 : e.message}`);
        return res.status(responce_status_1.ResponceStatus.ServerError).json({
            message: `Server error ${e === null || e === void 0 ? void 0 : e.message}`,
        });
    }
}));
exports.default = resetPasswordLinkRouter;
