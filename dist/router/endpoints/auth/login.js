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
const express_validator_1 = require("express-validator");
const responce_status_1 = require("../../../types/responce_status");
const userRegistred_1 = __importDefault(require("../../../middleware/userRegistred"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expire_in_ms_1 = __importDefault(require("../../../types/expire_in_ms"));
const loginRouter = (0, express_1.Router)();
const log = new log_1.default("Route: /login");
loginRouter.post("/", [userRegistred_1.default, (0, express_validator_1.body)("password", "bad password").isLength({ min: 5, max: 20 }).isString()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const database = req.database;
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
            return res.status(responce_status_1.ResponceStatus.NotAuthorized).json({
                message: "Password incorect",
                predicate: "PASS_INCORRECT",
            });
        }
        // Getting jwt secret  by current origin
        log.info(`request from ${req.headers.origin}`);
        const jwtSecret = yield req.database.getJwtSecretByOrigin(`${req.headers.origin}`);
        ////////////////////////
        //// Genereting JWT pair
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, jwtSecret, {
            expiresIn: "10m",
        });
        /// Check if an old refresh token exist, then delete
        yield database.findRefrTokenByUserId(user.id, true);
        /////////////////
        const refreshToken = yield database.createNewRefrToken(user.id, jwtSecret);
        res.cookie('refreshToken', refreshToken, {
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
exports.default = loginRouter;
