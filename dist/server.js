"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("config"));
const log_1 = __importDefault(require("./utils/log"));
const app_1 = __importDefault(require("./app"));
const log = new log_1.default("Server");
const HTTP_PORT = config_1.default.get('http_port');
const HTTPS_PORT = config_1.default.get('https_port');
try {
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(config_1.default.get('mongoUri'))
        .then(() => log.info('Mongo DB connection successfull'));
    mongoose_1.default.connection.on('error', (err) => log.error(err));
    http_1.default.createServer(app_1.default).listen(HTTP_PORT, () => log.info(`HTTP server listening on port ${HTTP_PORT}`));
    https_1.default.createServer({
        key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'sslcert/privkey.pem')),
        cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'sslcert/cert.pem')),
        ca: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'sslcert/chain.pem'))
    }, app_1.default).listen(HTTPS_PORT, () => log.info(`HTTPS server listening on port ${HTTPS_PORT}`));
}
catch (e) {
    log.error(`Server error ${e}`);
    process.exit(1);
}
