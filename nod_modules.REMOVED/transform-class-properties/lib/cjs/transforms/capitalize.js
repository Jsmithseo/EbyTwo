"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capitalize = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function Capitalize() {
    return function Capitalize(target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'Capitalize',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return originalValue.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.Capitalize = Capitalize;
;
