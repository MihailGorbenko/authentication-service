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
const ServiceUser_1 = __importDefault(require("../models/ServiceUser"));
const responce_status_1 = require("../router/responce_status");
const log_1 = __importDefault(require("../utils/log"));
const log = new log_1.default("Middleware: allowedEmail");
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function default_1(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const email = (_a = req.body) === null || _a === void 0 ? void 0 : _a.email;
        if (email) {
            if (email.toLowerCase().match(emailRegex)) {
                try {
                    const candidate = yield ServiceUser_1.default.findOne({ email }).exec();
                    if (candidate) {
                        log.info("Email already exists");
                        req.user = candidate;
                    }
                    else {
                        req.user = null;
                    }
                    next();
                }
                catch (e) {
                    log.error(`Error ${e === null || e === void 0 ? void 0 : e.message}`);
                    return res.status(responce_status_1.ResponceStatus.StorageError).json({
                        message: `Storage error ${e === null || e === void 0 ? void 0 : e.message}`,
                    });
                }
            }
            else {
                return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                    message: "Email incorect",
                    predicate: "INCORRECT",
                });
            }
        }
        else {
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: "Email required",
                predicate: "EMPTY_EMAIL",
            });
        }
    });
}
exports.default = default_1;
