"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveNonNumeric = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function RemoveNonNumeric() {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target: target,
            propertyKey,
            type: "REMOVE_NON_NUMERIC"
        });
    };
}
exports.RemoveNonNumeric = RemoveNonNumeric;
