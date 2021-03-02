"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Integer = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function Integer() {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target: target,
            propertyKey,
            type: "INTEGER"
        });
    };
}
exports.Integer = Integer;
