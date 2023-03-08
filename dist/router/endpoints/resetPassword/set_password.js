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
const express_validator_1 = require("express-validator");
const log_1 = __importDefault(require("../../../utils/log"));
const responce_status_1 = require("../../../types/responce_status");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const setPasswordRouter = (0, express_1.Router)();
const log = new log_1.default('Route: /setPassword');
setPasswordRouter.post('/', [
    (0, express_validator_1.body)('password', 'bad password').isLength({ min: 5 }).isString(),
    (0, express_validator_1.body)('token', 'bad token').isString().isLength({ min: 1 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        ///// Validating request params
        if (!errors.isEmpty()) {
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: "Bad password or token",
                predicate: "INCORRECT",
                errors: errors.array(),
            });
        }
        const { password, token } = req.body;
        const database = req.database;
        const resetPasswordRecord = yield database.findRPToken(token, true);
        /// Check if token exists
        if (!resetPasswordRecord) {
            log.info('Reset token not found');
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: 'Reset token incorect or expired'
            });
        }
        log.info('Token found');
        const userId = resetPasswordRecord.userId;
        const serviceUser = yield database.findUserById(userId);
        if (!serviceUser) {
            log.info('User not found');
            return res.status(responce_status_1.ResponceStatus.StorageError).json({
                message: 'User not found'
            });
        }
        //// Hashing new password,updating user
        const hashedPassword = bcrypt_1.default.hashSync(password, config_1.default.get('passwordSalt'));
        serviceUser.password = hashedPassword;
        yield serviceUser.save();
        log.info('Password reset');
        return res.status(responce_status_1.ResponceStatus.Success).json({
            message: 'Password reset'
        });
    }
    catch (e) {
        log.error(`Error ${e === null || e === void 0 ? void 0 : e.message}`);
        return res.status(responce_status_1.ResponceStatus.ServerError).json({
            message: `Server error ${e === null || e === void 0 ? void 0 : e.message}`,
        });
    }
}));
exports.default = setPasswordRouter;
