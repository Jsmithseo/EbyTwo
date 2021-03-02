"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = void 0;
function isString(value) {
    if (typeof (value) !== 'string') {
        throw new Error(`transform-class-properties: ${value} is not string.`);
    }
    return true;
}
exports.isString = isString;
