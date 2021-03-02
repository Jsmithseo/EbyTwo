"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regex = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function Regex(expression) {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'Regex',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return originalValue.match(expression).join('');
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.Regex = Regex;
;
