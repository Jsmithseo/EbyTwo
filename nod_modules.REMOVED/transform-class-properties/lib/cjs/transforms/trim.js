"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trim = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function Trim() {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'Trim',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return originalValue.trim();
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.Trim = Trim;
;
