import { TransformerTypes } from './transformerTypes';
export interface Metadata {
    target: Object;
    propertyKey: string | symbol;
    type: TransformerTypes;
    params?: any;
    options?: any;
}
declare class MetadataStorage {
    private readonly metadataStore;
    addMetadata(metadata: Metadata): void;
    getMetadatasForClassInstance(classInstance: Object): Metadata[];
}
export declare const metadataStorage: MetadataStorage;
export {};
