"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToBoolean = void 0;
function ToBoolean(target, propertyKey) {
    let _value = target[propertyKey];
    const getter = () => _value;
    const setter = (originalValue) => _value = Boolean(originalValue);
    Object.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter
    });
}
exports.ToBoolean = ToBoolean;
;
