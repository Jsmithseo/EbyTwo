interface RegisterDecoratorParams {
    name: string;
    propertyName: string;
    setter: (originalValue?: any) => any;
    target: Object;
}
export declare function registerDecorator(params: RegisterDecoratorParams): void;
export {};
