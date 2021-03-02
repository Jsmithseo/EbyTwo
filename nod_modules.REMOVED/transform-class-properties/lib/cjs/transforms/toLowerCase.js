"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToLowerCase = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function ToLowerCase() {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'ToLowerCase',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return originalValue.toLowerCase();
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.ToLowerCase = ToLowerCase;
;
