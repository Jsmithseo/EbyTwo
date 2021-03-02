"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prepend = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function Prepend(additionalValue) {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'Prepend',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return `${additionalValue}${originalValue}`;
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.Prepend = Prepend;
;
