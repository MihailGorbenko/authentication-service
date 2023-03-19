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
exports.DB = void 0;
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
const ServiceUser_1 = __importDefault(require("../models/ServiceUser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ResetPasswordToken_1 = __importDefault(require("../models/ResetPasswordToken"));
const DevOrigin_1 = __importDefault(require("../models/DevOrigin"));
const PersistOrigin_1 = __importDefault(require("../models/PersistOrigin"));
const log_1 = __importDefault(require("../utils/log"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
class DB {
}
exports.DB = DB;
class Database extends DB {
    constructor() {
        super();
        this.connection = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const log = new log_1.default("Database");
            mongoose_1.default.set('strictQuery', false);
            mongoose_1.default.connection.on('error', (err) => log.error(err));
            mongoose_1.default.connection.once('open', () => log.info('Mongo DB connection successfull'));
            this.connection = mongoose_1.default.connection;
            yield mongoose_1.default.connect(config_1.default.get('mongoUri'));
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                yield this.connection.close();
                this.connection = null;
            }
        });
    }
    getJwtSecretByOrigin(origin) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = yield PersistOrigin_1.default.findOne({ origin });
            if (!record) {
                record = yield DevOrigin_1.default.findOne({ origin });
            }
            if (record)
                return record.jwtSecret;
            else
                throw new Error(`Can't find jwtSecret for ${origin}`);
        });
    }
    addAllowedOrigin(origin, dev) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtSecret = crypto_1.default.randomUUID();
            const newOrigin = dev
                ?
                    new DevOrigin_1.default({ origin, jwtSecret })
                :
                    new PersistOrigin_1.default({ origin, jwtSecret });
            yield newOrigin.save();
            return jwtSecret;
        });
    }
    getAllowedOrigins() {
        return __awaiter(this, void 0, void 0, function* () {
            const origins = [];
            const persistOrigins = yield PersistOrigin_1.default.find();
            const devOrigins = yield DevOrigin_1.default.find();
            if (devOrigins)
                devOrigins.forEach((doc) => { origins.push({ name: doc.origin, dev: true }); });
            if (persistOrigins)
                persistOrigins.forEach((doc) => { origins.push({ name: doc.origin, dev: false }); });
            return origins;
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield ServiceUser_1.default.findOne(userId);
            return user;
        });
    }
    findRPTokenByUserId(userId, remove) {
        return __awaiter(this, void 0, void 0, function* () {
            let RPToken = remove
                ?
                    yield ResetPasswordToken_1.default.findOneAndDelete({ userId })
                :
                    yield ResetPasswordToken_1.default.findOne({ userId });
            return RPToken;
        });
    }
    findRPToken(token, remove) {
        return __awaiter(this, void 0, void 0, function* () {
            let RPToken = remove
                ?
                    yield ResetPasswordToken_1.default.findOneAndDelete({ token })
                :
                    yield ResetPasswordToken_1.default.findOne({ token });
            return RPToken;
        });
    }
    createNewRPToken(userId, clientUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const RPToken = yield new ResetPasswordToken_1.default({
                userId,
                token: crypto_1.default.randomUUID(),
                clientUrl
            }).save();
            return RPToken;
        });
    }
    findRefrToken(token, remove) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = remove
                ?
                    yield RefreshToken_1.default.findOneAndDelete({ token })
                :
                    yield RefreshToken_1.default.findOne({ token });
            return refreshToken;
        });
    }
    createNewRefrToken(userId, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({}, secret, {});
            const RTRecord = new RefreshToken_1.default({ token, userId });
            yield RTRecord.save();
            return token;
        });
    }
    findRefrTokenByUserId(userId, remove) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldRefreshToken = remove
                ?
                    yield RefreshToken_1.default.findOneAndDelete({ userId })
                :
                    yield RefreshToken_1.default.findOne({ userId });
            return oldRefreshToken;
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield ServiceUser_1.default.findOne({ email }).exec();
            return user;
        });
    }
    addServiceUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashPswd = bcrypt_1.default.hashSync(user.password.toString(), config_1.default.get("passwordSalt"));
            const serviceUser = new ServiceUser_1.default({ email: user.email, password: hashPswd });
            const saved = yield serviceUser.save();
            return saved.id;
        });
    }
}
exports.default = Database;
