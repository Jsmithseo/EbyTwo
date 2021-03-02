"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Append = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function Append(additionalValue) {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target,
            propertyKey,
            type: "APPEND",
            params: {
                additionalValue
            }
        });
    };
}
exports.Append = Append;
