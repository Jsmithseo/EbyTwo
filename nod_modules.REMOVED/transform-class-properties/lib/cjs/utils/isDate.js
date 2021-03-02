"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDate = void 0;
function isDate(value) {
    if (value instanceof Date) {
        const error = new Error('sss');
        throw error;
    }
    return true;
}
exports.isDate = isDate;
