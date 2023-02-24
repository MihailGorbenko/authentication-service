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
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("config"));
const log_1 = __importDefault(require("../utils/log"));
const path_1 = __importDefault(require("path"));
const ServiceUser_1 = __importDefault(require("../models/ServiceUser"));
var ResponceStatus;
(function (ResponceStatus) {
    ResponceStatus[ResponceStatus["NotFound"] = 404] = "NotFound";
    ResponceStatus[ResponceStatus["BadRequest"] = 400] = "BadRequest";
    ResponceStatus[ResponceStatus["NotAuthorized"] = 401] = "NotAuthorized";
    ResponceStatus[ResponceStatus["Success"] = 200] = "Success";
    ResponceStatus[ResponceStatus["StorageError"] = 507] = "StorageError";
    ResponceStatus[ResponceStatus["ServerError"] = 500] = "ServerError";
})(ResponceStatus || (ResponceStatus = {}));
const router = (0, express_1.Router)();
///TEST 
router.get('/', (req, res) => {
    const log = new log_1.default('test');
    log.info('in test');
    res.sendFile(path_1.default.join(__dirname, '../../test/test-form.html'));
});
//REGISTER
router.post('/register', [
    (0, express_validator_1.body)('email', 'bad email').isEmail(),
    (0, express_validator_1.body)('password', 'bad password').isString().isLength({ min: 5 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const log = new log_1.default('Route: /register');
    try {
        ///// Validating request params
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(ResponceStatus.BadRequest).json({
                message: 'Incorect credentials',
                predicate: 'INCORECT',
                errors: errors.array()
            });
        }
        //////////////////////////////////////////
        const { email, password } = req.body;
        ///// Check email in database
        const emailExists = yield ServiceUser_1.default.findOne({ email }).exec();
        if (emailExists) {
            log.error(`User ${email} already exists`);
            return res.status(ResponceStatus.BadRequest).json({
                message: 'User already exists',
                predicate: 'EXIST'
            });
        }
        //// Create new service user
        log.info(`Creating service user ${email}`);
        const hashPswd = bcrypt_1.default.hashSync(password, config_1.default.get('passwordSalt'));
        const serviceUser = new ServiceUser_1.default({ email, password })
            .save()
            .then(onfullfiled => {
            log.info('User saved successfully');
            return res.status(ResponceStatus.Success).json({
                message: 'User registred successfully',
            });
        }, onrejected => {
            log.error('Error saving user');
            return res.status(ResponceStatus.StorageError).json({
                message: 'Error saving user',
            });
        });
        ////////////////////////////////////////////
    }
    catch (e) {
        log.error(e);
        return res.status(ResponceStatus.ServerError).json({
            message: `Server error ${e}`
        });
    }
}));
//LOGIN
//CHECK_EMAIL
//REFRESH_LOGIN
//RESET_PASSWORD
//RESET_PASWORD_LINK
//SET_PASSWORD
exports.default = router;
