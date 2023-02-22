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
const config_1 = __importDefault(require("config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const log_1 = __importDefault(require("./utils/log"));
const log = new log_1.default("app");
const HTTP_PORT = config_1.default.get('http_port');
const HTTPS_PORT = config_1.default.get('https_port');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            mongoose_1.default.set('strictQuery', false);
            mongoose_1.default.connect(config_1.default.get('mongoUri'))
                .then(() => log.info('Mongo DB connection successfull'));
            mongoose_1.default.connection.on('error', (err) => log.error(err));
            http_1.default.createServer(app).listen(HTTP_PORT, () => log.info(`HTTP server listening on port ${HTTP_PORT}`));
            https_1.default.createServer({
                key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'sslcert/privkey.pem')),
                cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'sslcert/cert.pem')),
                ca: fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'sslcert/chain.pem'))
            }, app).listen(HTTPS_PORT, () => log.info(`HTTPS server listening on port ${HTTPS_PORT}`));
        }
        catch (e) {
            log.error(`Server error ${e}`);
            process.exit(1);
        }
    });
}
start();
