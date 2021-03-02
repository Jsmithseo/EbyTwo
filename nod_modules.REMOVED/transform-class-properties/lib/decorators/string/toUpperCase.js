"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToUpperCase = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function ToUpperCase() {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target: target,
            propertyKey,
            type: "TO_UPPER_CASE"
        });
    };
}
exports.ToUpperCase = ToUpperCase;
