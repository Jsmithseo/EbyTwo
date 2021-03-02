"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = void 0;
function isNumber(value) {
    if (!Boolean(Number(value))) {
        throw new Error(`transform-class-properties: ${value} is not number.`);
    }
    return true;
}
exports.isNumber = isNumber;
