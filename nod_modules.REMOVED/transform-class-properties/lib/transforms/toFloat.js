"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToFloat = void 0;
const isNumber_1 = require("../utils/isNumber");
function ToFloat(target, propertyKey) {
    let _value = target[propertyKey];
    const getter = () => _value;
    const setter = (originalValue) => {
        if (isNumber_1.isNumber(originalValue)) {
            _value = parseFloat(originalValue);
        }
    };
    Object.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter
    });
}
exports.ToFloat = ToFloat;
;
