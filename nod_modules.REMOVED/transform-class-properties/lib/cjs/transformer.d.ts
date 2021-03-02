import { Metadata } from './metadataStorage';
export declare class Transformer {
    private readonly metadataStorage;
    static append(value: string, additionalValue: string | number): string;
    static capitalize(value: string): string;
    static float(value: number, fractionDigits?: number): number;
    static integer(value: number): number;
    static prepend(value: string, additionalValue: string | number): string;
    static regex(value: string, expression: RegExp): string;
    static removeNonNumeric(value: string): string;
    static removeNumeric(value: string): string;
    static replace(value: string, searchValue: string | RegExp, replaceValue: string): string;
    static toLowerCase(value: string): string;
    static toUpperCase(value: string): string;
    static trim(value: string): string;
    transform<T = Record<string, any>>(classInstance: InstanceType<any>): T;
    transformValue(value: any, metadata: Metadata): any;
}
