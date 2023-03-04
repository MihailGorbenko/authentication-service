"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("config"));
const log_1 = __importDefault(require("./utils/log"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./storage/db"));
const log = new log_1.default("Server");
const HTTP_PORT = config_1.default.get('http_port');
const HTTPS_PORT = config_1.default.get('https_port');
let db;
try {
    db = (0, db_1.default)();
    const app = (0, app_1.default)(db);
    http_1.default.createServer(app).listen(HTTP_PORT, () => log.info(`HTTP server listening on port ${HTTP_PORT}`));
    https_1.default.createServer({
        key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'sslcert/privkey.pem')),
        cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'sslcert/cert.pem')),
        ca: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'sslcert/chain.pem'))
    }, app).listen(HTTPS_PORT, () => log.info(`HTTPS server listening on port ${HTTPS_PORT}`));
}
catch (e) {
    log.error(`Server error ${e}`);
    db === null || db === void 0 ? void 0 : db.close();
    process.exit(1);
}
