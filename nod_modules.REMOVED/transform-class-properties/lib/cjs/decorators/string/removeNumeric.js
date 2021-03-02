"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveNumeric = void 0;
const metadataStorage_1 = require("../../metadataStorage");
function RemoveNumeric() {
    return function (target, propertyKey) {
        metadataStorage_1.metadataStorage.addMetadata({
            target: target,
            propertyKey,
            type: "REMOVE_NUMERIC"
        });
    };
}
exports.RemoveNumeric = RemoveNumeric;
