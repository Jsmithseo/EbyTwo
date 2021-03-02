"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveNonNumeric = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function RemoveNonNumeric() {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'RemoveNonNumeric',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return originalValue.replace(/\D/g, '');
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.RemoveNonNumeric = RemoveNonNumeric;
;
