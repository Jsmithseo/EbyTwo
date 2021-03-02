"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateToUnix = void 0;
const isDate_1 = require("../utils/isDate");
function DateToUnix(target, propertyKey) {
    let _value = target[propertyKey];
    const getter = () => _value;
    const setter = (originalValue) => {
        if (isDate_1.isDate(originalValue)) {
            _value = originalValue.getTime() / 1000;
        }
    };
    Object.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter
    });
}
exports.DateToUnix = DateToUnix;
;
