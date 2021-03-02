"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToUpperCase = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function ToUpperCase() {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'ToUpperCase',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return originalValue.toUpperCase();
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.ToUpperCase = ToUpperCase;
;
