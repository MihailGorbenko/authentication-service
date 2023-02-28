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
const RefreshToken_1 = __importDefault(require("../../../models/RefreshToken"));
const log_1 = __importDefault(require("../../../utils/log"));
const responce_status_1 = require("../../responce_status");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const expire_in_ms_1 = __importDefault(require("../../expire_in_ms"));
const refreshTokenRouter = (0, express_1.Router)();
const log = new log_1.default('Route /refreshToken');
refreshTokenRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: 'Refresh token missing',
                predicate: 'MISSING_TOKEN'
            });
        }
        const tokenRecord = yield RefreshToken_1.default.findOne({ token: refreshToken });
        if (!tokenRecord) {
            return res.status(responce_status_1.ResponceStatus.NotAuthorized).json({
                message: 'Refresh token not exists or already deprecated',
                predicate: 'BAD_TOKEN'
            });
        }
        const { userId } = tokenRecord;
        yield tokenRecord.deleteOne();
        //// Genereting JWT pair
        const accessToken = jsonwebtoken_1.default.sign({
            id: userId
        }, config_1.default.get("jwtSecret"), {
            expiresIn: "10m",
        });
        const newRefreshToken = jsonwebtoken_1.default.sign({}, config_1.default.get("jwtSecret"), {});
        const RTRecord = new RefreshToken_1.default({ token: newRefreshToken, userId });
        //// Recording refresh token
        yield RTRecord.save();
        ///////////////
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: expire_in_ms_1.default['1month'],
            sameSite: 'none',
            path: '/refreshToken'
        });
        return res.status(responce_status_1.ResponceStatus.Success).json({
            accessToken: JSON.stringify(accessToken),
        });
    }
    catch (e) {
        log.error(`Error ${e === null || e === void 0 ? void 0 : e.message}`);
        return res.status(responce_status_1.ResponceStatus.ServerError).json({
            message: `Server error ${e === null || e === void 0 ? void 0 : e.message}`,
        });
    }
}));
exports.default = refreshTokenRouter;
