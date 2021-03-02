"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Integer = void 0;
const isNumber_1 = require("../utils/isNumber");
const registerDecorator_1 = require("../utils/registerDecorator");
function Integer() {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'Integer',
            propertyName,
            setter: (originalValue) => {
                if (isNumber_1.isNumber(originalValue)) {
                    return parseInt(originalValue);
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.Integer = Integer;
;
