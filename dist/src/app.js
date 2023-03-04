"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const appRouter_1 = __importDefault(require("./router/appRouter"));
const attachDatabase_1 = __importDefault(require("./middleware/attachDatabase"));
const httpsRredirect_1 = __importDefault(require("./middleware/httpsRredirect"));
function createApp(db) {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ credentials: true, origin: config_1.default.get('allowedOrigins') }));
    if (process.env.NODE_ENV === "production")
        app.use(httpsRredirect_1.default);
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, attachDatabase_1.default)(db));
    app.use('/', appRouter_1.default);
    return app;
}
exports.default = createApp;
