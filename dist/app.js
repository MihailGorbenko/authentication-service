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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const appRouter_1 = __importDefault(require("./router/appRouter"));
const attachDatabase_1 = __importDefault(require("./middleware/attachDatabase"));
const path_1 = __importDefault(require("path"));
function createApp(db) {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        credentials: true,
        origin: (origin, callback) => __awaiter(this, void 0, void 0, function* () {
            const origins = yield db.getAllowedOrigins();
            if (origins)
                callback(null, origins.map(orgn => orgn.name.toString()));
            else
                callback(null, []);
        })
    }));
    // if (process.env.NODE_ENV === "production") app.use(httpsRredirect) // Use if run own https server in start() function
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, attachDatabase_1.default)(db));
    app.use('/', appRouter_1.default);
    app.use(express_1.default.static(path_1.default.resolve(__dirname, './public')));
    app.get("/:universalURL", (req, res) => {
        res.send("404 URL NOT FOUND");
    });
    return app;
}
exports.default = createApp;
