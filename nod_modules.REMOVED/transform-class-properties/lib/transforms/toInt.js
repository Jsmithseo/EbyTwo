"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToInt = void 0;
const isNumber_1 = require("../utils/isNumber");
function ToInt(target, propertyKey) {
    let _value = target[propertyKey];
    const getter = () => _value;
    const setter = (originalValue) => {
        if (isNumber_1.isNumber(originalValue)) {
            _value = parseInt(originalValue);
        }
    };
    Object.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter
    });
}
exports.ToInt = ToInt;
;
