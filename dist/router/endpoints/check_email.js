"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRegistred_1 = __importDefault(require("../../middleware/userRegistred"));
const log_1 = __importDefault(require("../../utils/log"));
const responce_status_1 = require("../responce_status");
const checkEmailRouter = (0, express_1.Router)();
const log = new log_1.default('Route: /checkEmail');
checkEmailRouter.post('/', [userRegistred_1.default], (req, res) => {
    try {
        const status = req.user ? responce_status_1.ResponceStatus.Success : responce_status_1.ResponceStatus.NotAuthorized;
        const responseObj = {
            message: req.user ? 'User registred' : 'User not registred',
            predicate: req.user ? 'EXISTS' : 'NOT_EXISTS'
        };
        return res.status(status).json(responseObj);
    }
    catch (e) {
        log.error(`Error ${e === null || e === void 0 ? void 0 : e.message}`);
        return res.status(responce_status_1.ResponceStatus.ServerError).json({
            message: `Server error ${e === null || e === void 0 ? void 0 : e.message}`,
        });
    }
});
exports.default = checkEmailRouter;
