"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = __importDefault(require("../utils/log"));
const config_1 = __importDefault(require("config"));
const db_api_1 = __importDefault(require("./db.api"));
function createDatabase() {
    const log = new log_1.default("Database");
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(config_1.default.get('mongoUri'))
        .then(() => log.info('Mongo DB connection successfull'));
    mongoose_1.default.connection.on('error', (err) => log.error(err));
    const database = new db_api_1.default();
    database.close = () => { mongoose_1.default.connection.close(); };
    return database;
}
exports.default = createDatabase;
