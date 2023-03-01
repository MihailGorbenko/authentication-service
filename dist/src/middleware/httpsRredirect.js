"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    if (!req.secure) {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
}
exports.default = default_1;
