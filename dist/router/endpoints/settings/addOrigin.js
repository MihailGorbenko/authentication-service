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
const config_1 = __importDefault(require("config"));
const responce_status_1 = require("../../../types/responce_status");
const log_1 = __importDefault(require("../../../utils/log"));
const addOriginRouter = (0, express_1.Router)();
const log = new log_1.default('Route: /addOrigin');
addOriginRouter.post('/', [
    (0, express_validator_1.body)('login', 'badLogin').isIn(['Dev', 'Admin']),
    (0, express_validator_1.body)('password', 'badPassword').isAlphanumeric().isLength({ min: 5 }),
    (0, express_validator_1.body)('origin', 'bad origin').isURL().isString()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        ///Check params
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: 'Incorrect credentials or origin',
                predicate: 'INCORRECT',
                errors: errors.array()
            });
        }
        /////////////////
        const { login, password, origin } = req.body;
        const database = req.database;
        if (login === 'Dev') {
            if (password === config_1.default.get('devPassword')) {
                const addResult = yield database.addAllowedOrigin(origin, true);
                return res
                    .status(addResult ? responce_status_1.ResponceStatus.Success : responce_status_1.ResponceStatus.StorageError)
                    .json({
                    message: addResult ? 'Added succesfully' : 'Error saving origin',
                    predicate: addResult ? 'SUCCESS' : 'ERROR'
                });
            }
            else {
                return res.status(responce_status_1.ResponceStatus.NotAuthorized).json({
                    message: 'Invalid password for {dev}',
                    predicate: 'INVALID'
                });
            }
        }
        else {
            if (password === config_1.default.get('adminPassword')) {
                const addResult = yield database.addAllowedOrigin(origin, false);
                return res
                    .status(addResult ? responce_status_1.ResponceStatus.Success : responce_status_1.ResponceStatus.StorageError)
                    .json({
                    message: addResult ? 'Added succesfully' : 'Error saving origin',
                    predicate: addResult ? 'SUCCESS' : 'ERROR'
                });
            }
            else {
                return res.status(responce_status_1.ResponceStatus.NotAuthorized).json({
                    message: 'Invalid password for {admin}',
                    predicate: 'INVALID'
                });
            }
        }
    }
    catch (err) {
        log.error(`Error ${err === null || err === void 0 ? void 0 : err.message}`);
        return res.status(responce_status_1.ResponceStatus.ServerError).json({
            message: `Server error ${err === null || err === void 0 ? void 0 : err.message}`,
        });
    }
}));
exports.default = addOriginRouter;
