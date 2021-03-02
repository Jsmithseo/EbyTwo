"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trim = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function Trim() {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target: target,
            propertyKey,
            type: "TRIM"
        });
    };
}
exports.Trim = Trim;
