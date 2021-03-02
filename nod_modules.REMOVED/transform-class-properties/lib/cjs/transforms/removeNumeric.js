"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveNumeric = void 0;
const isString_1 = require("../utils/isString");
const registerDecorator_1 = require("../utils/registerDecorator");
function RemoveNumeric() {
    return function (target, propertyName) {
        registerDecorator_1.registerDecorator({
            name: 'RemoveNumeric',
            propertyName,
            setter: (originalValue) => {
                if (isString_1.isString(originalValue)) {
                    return originalValue.replace(/[0-9]/g, '');
                }
                else
                    return undefined;
            },
            target
        });
    };
}
exports.RemoveNumeric = RemoveNumeric;
;
