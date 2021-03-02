"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prepend = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function Prepend(additionalValue) {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target,
            propertyKey,
            type: "PREPEND",
            params: {
                additionalValue
            }
        });
    };
}
exports.Prepend = Prepend;
