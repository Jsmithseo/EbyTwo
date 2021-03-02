"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Replace = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function Replace(searchValue, replaceValue) {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'Replace',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return originalValue.toString().replace(searchValue, replaceValue);
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.Replace = Replace;
;
