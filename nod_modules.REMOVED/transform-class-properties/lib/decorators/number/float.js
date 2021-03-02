"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Float = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function Float(fractionDigits) {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target: target,
            propertyKey,
            type: "FLOAT",
            params: {
                fractionDigits
            }
        });
    };
}
exports.Float = Float;
