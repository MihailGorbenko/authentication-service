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
const express_validator_1 = require("express-validator");
const log_1 = __importDefault(require("../../../utils/log"));
const responce_status_1 = require("../../../types/responce_status");
const express_1 = require("express");
const userRegistred_1 = __importDefault(require("../../../middleware/userRegistred"));
const registerRouter = (0, express_1.Router)();
const log = new log_1.default("Route: /register");
registerRouter.post("/", [
    userRegistred_1.default,
    (0, express_validator_1.body)("password", "bad password").isString().isLength({ min: 5, max: 20 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        ///// Validating request params
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: "Incorect credentials",
                predicate: "INCORRECT",
                errors: errors.array(),
            });
        }
        //////////////////////////////////////////
        const { email, password } = req.body;
        const database = req.database;
        ///// Check email 
        if (req.user) {
            log.info(`User ${email} already exists`);
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: "User already registred",
                predicate: "EXIST",
            });
        }
        //// Create new service user
        log.info(`Creating service user ${email}`);
        const userId = yield database.addServiceUser({ email, password });
        return res.status(responce_status_1.ResponceStatus.Success).json({
            message: 'User registred successfully',
            userId
        });
        ////////////////////////////////////////////
    }
    catch (e) {
        log.error(`Error ${e === null || e === void 0 ? void 0 : e.message}`);
        return res.status(responce_status_1.ResponceStatus.ServerError).json({
            message: `Server error ${e === null || e === void 0 ? void 0 : e.message}`,
        });
    }
}));
exports.default = registerRouter;
