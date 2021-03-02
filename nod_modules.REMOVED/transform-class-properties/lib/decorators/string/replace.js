"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Replace = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function Replace(searchValue, replaceValue) {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target: target,
            propertyKey,
            type: "REPLACE",
            params: {
                searchValue,
                replaceValue
            }
        });
    };
}
exports.Replace = Replace;
