"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regex = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function Regex(expression) {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target,
            propertyKey,
            type: "REGEX",
            params: {
                expression
            }
        });
    };
}
exports.Regex = Regex;
