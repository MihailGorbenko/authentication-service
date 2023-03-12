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
const log_1 = __importDefault(require("../../utils/log"));
const express_validator_1 = require("express-validator");
const responce_status_1 = require("../responce_status");
const userRegistred_1 = __importDefault(require("../../middleware/userRegistred"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const RefreshToken_1 = __importDefault(require("../../models/RefreshToken"));
const loginRouter = (0, express_1.Router)();
const log = new log_1.default("Route: /login");
loginRouter.post("/", [userRegistred_1.default, (0, express_validator_1.body)("password", "bad password").isLength({ min: 5 })], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        ///// Validating request params
        if (!errors.isEmpty()) {
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: "Incorect credentials",
                predicate: "INCORRECT",
                errors: errors.array(),
            });
        }
        ///////////////////////////////
        const { email, password } = req.body;
        const user = req.user;
        ///// Check user
        if (!user) {
            log.info(`User ${email} not registred`);
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: "User not registred",
                predicate: "NOT_EXIST",
            });
        }
        //// Matching password
        const passwordMatch = bcrypt_1.default.compareSync(password, user.password.toString());
        if (!passwordMatch) {
            return res.status(responce_status_1.ResponceStatus.BadRequest).json({
                message: "Password incorect",
                predicate: "PASS_INCORRECT",
            });
        }
        ////////////////////////
        //// Genereting JWT pair
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, config_1.default.get("jwtSecret"), {
            expiresIn: "10m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({}, config_1.default.get("jwtSecret"), {});
        const RTRecord = new RefreshToken_1.default({ token: refreshToken });
        //// Recording refresh token
        RTRecord.save().then((onfullfiled) => {
            log.info("Refresh token saved");
        }, (onrejected) => {
            log.error("Error saving refresh token");
            return res.status(responce_status_1.ResponceStatus.StorageError).json({
                message: "Error saving refresh token",
            });
        });
        ///////////////
        return res.status(responce_status_1.ResponceStatus.Success).json({
            accessToken: JSON.stringify(accessToken),
            refreshToken: JSON.stringify(refreshToken),
        });
    }
    catch (e) {
        log.error(`Error ${e === null || e === void 0 ? void 0 : e.message}`);
        return res.status(responce_status_1.ResponceStatus.ServerError).json({
            message: `Server error ${e === null || e === void 0 ? void 0 : e.message}`,
        });
    }
}));
exports.default = loginRouter;
