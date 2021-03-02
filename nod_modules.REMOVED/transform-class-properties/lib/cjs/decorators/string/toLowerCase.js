"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToLowerCase = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function ToLowerCase() {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target: target,
            propertyKey,
            type: "TO_LOWER_CASE"
        });
    };
}
exports.ToLowerCase = ToLowerCase;
