"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponceStatus = void 0;
var ResponceStatus;
(function (ResponceStatus) {
    ResponceStatus[ResponceStatus["NotFound"] = 404] = "NotFound";
    ResponceStatus[ResponceStatus["BadRequest"] = 400] = "BadRequest";
    ResponceStatus[ResponceStatus["NotAuthorized"] = 401] = "NotAuthorized";
    ResponceStatus[ResponceStatus["Success"] = 200] = "Success";
    ResponceStatus[ResponceStatus["StorageError"] = 507] = "StorageError";
    ResponceStatus[ResponceStatus["ServerError"] = 500] = "ServerError";
})(ResponceStatus = exports.ResponceStatus || (exports.ResponceStatus = {}));
