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
exports.createHttpServer = void 0;
const config_1 = __importDefault(require("config"));
const log_1 = __importDefault(require("./utils/log"));
const app_1 = __importDefault(require("./app"));
const createDatabase_1 = __importDefault(require("./storage/createDatabase"));
const log = new log_1.default("Server");
const HTTP_PORT = config_1.default.get('http_port');
function createHttpServer(app) {
    return app.listen(HTTP_PORT, () => log.info(`HTTP server listening on port ${HTTP_PORT}`));
}
exports.createHttpServer = createHttpServer;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = null;
        try {
            db = yield (0, createDatabase_1.default)();
            const app = (0, app_1.default)(db);
            createHttpServer(app);
        }
        catch (e) {
            log.error(`Server error ${e}`);
            db === null || db === void 0 ? void 0 : db.close();
            process.exit(1);
        }
    });
}
exports.default = start;
