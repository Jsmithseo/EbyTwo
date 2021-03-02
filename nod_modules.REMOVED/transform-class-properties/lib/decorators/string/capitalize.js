"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capitalize = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function Capitalize() {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target,
            propertyKey,
            type: "CAPITALIZE"
        });
    };
}
exports.Capitalize = Capitalize;
