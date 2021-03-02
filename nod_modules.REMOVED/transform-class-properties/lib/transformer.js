"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformer = void 0;
const metadataStorage_1 = require("./metadataStorage");
class Transformer {
    constructor() {
        this.metadataStorage = metadataStorage_1.metadataStorage;
    }
    static append(value, additionalValue) {
        return `${value}${additionalValue}`;
    }
    static capitalize(value) {
        return value.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
    }
    static float(value, fractionDigits) {
        if (fractionDigits) {
            return Number(parseFloat(String(value)).toFixed(fractionDigits));
        }
        return Number(parseFloat(String(value)));
    }
    static integer(value) {
        return parseInt(String(value));
    }
    static prepend(value, additionalValue) {
        return `${additionalValue}${value}`;
    }
    static regex(value, expression) {
        return value.match(expression).join('');
    }
    static removeNonNumeric(value) {
        return value.replace(/\D/g, '');
    }
    static removeNumeric(value) {
        return value.replace(/[0-9]/g, '');
    }
    static replace(value, searchValue, replaceValue) {
        return value.replace(searchValue, replaceValue);
    }
    static toLowerCase(value) {
        return value.toLowerCase();
    }
    static toUpperCase(value) {
        return value.toUpperCase();
    }
    static trim(value) {
        return value.trim();
    }
    transform(classInstance) {
        this.metadataStorage
            .getMetadatasForClassInstance(classInstance)
            .filter(({ propertyKey }) => classInstance[propertyKey] !== undefined && classInstance[propertyKey] !== null)
            .forEach((metadata) => {
            classInstance[metadata.propertyKey] = this.transformValue(classInstance[metadata.propertyKey], metadata);
        });
        return classInstance;
    }
    transformValue(value, metadata) {
        switch (metadata.type) {
            case "CAPITALIZE":
                return Transformer.append(value, metadata.params.additionalValue);
            case "CAPITALIZE":
                return Transformer.capitalize(value);
            case "FLOAT":
                return Transformer.float(value, metadata.params.fractionDigits);
            case "INTEGER":
                return Transformer.integer(value);
            case "REGEX":
                return Transformer.regex(value, metadata.params.expression);
            case "REMOVE_NON_NUMERIC":
                return Transformer.removeNonNumeric(value);
            case "REMOVE_NUMERIC":
                return Transformer.removeNumeric(value);
            case "REPLACE":
                return Transformer.replace(value, metadata.params.searchValue, metadata.params.replaceValue);
            case "TO_LOWER_CASE":
                return Transformer.toLowerCase(value);
            case "TO_UPPER_CASE":
                return Transformer.toUpperCase(value);
            case "TRIM":
                return Transformer.trim(value);
            default:
                return value;
        }
    }
}
exports.Transformer = Transformer;
