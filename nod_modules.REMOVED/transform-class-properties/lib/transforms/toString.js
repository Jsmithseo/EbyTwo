"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToString = void 0;
function ToString(target, propertyKey) {
    let _value = target[propertyKey];
    const getter = () => _value;
    const setter = (originalValue) => _value = String(originalValue);
    Object.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter
    });
}
exports.ToString = ToString;
;
