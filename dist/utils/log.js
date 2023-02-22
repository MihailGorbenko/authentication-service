"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    constructor(methodName = '') {
        this.methodName = '';
        this.methodName = methodName;
    }
    error(subject) {
        console.log(`[-SERVER ERROR-] in (${this.methodName}):: ${subject}`);
    }
    info(subject) {
        console.log(`[-SERVER INFO-] from (${this.methodName}):: ${subject}`);
    }
    log(subject) {
        console.log(subject);
    }
}
exports.default = Log;
