"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Float = void 0;
const isNumber_1 = require("../utils/isNumber");
const registerDecorator_1 = require("../utils/registerDecorator");
function Float(decimalLength) {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'Float',
            propertyName,
            setter: (originalValue) => {
                if (isNumber_1.isNumber(originalValue)) {
                    return parseFloat(originalValue).toFixed(decimalLength);
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.Float = Float;
;
