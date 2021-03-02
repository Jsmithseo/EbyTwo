"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDecorator = void 0;
function registerDecorator(params) {
    const { name, propertyName, setter, target } = params;
    let _value = target[propertyName];
    const getter = () => _value;
    const internalSetter = (originalValue) => {
        const newValue = setter(originalValue);
        newValue
            ? _value = newValue
            : _value = originalValue;
    };
    if (delete this[propertyName]) {
        Object.defineProperty(target, propertyName, {
            configurable: true,
            enumerable: true,
            get: getter,
            set: internalSetter
        });
    }
}
exports.registerDecorator = registerDecorator;
