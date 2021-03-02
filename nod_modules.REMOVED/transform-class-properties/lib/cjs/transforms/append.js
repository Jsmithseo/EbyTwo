"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Append = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function Append(additionalValue) {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'Append',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return `${originalValue}${additionalValue}`;
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.Append = Append;
;
