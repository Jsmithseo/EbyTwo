"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataStorage = void 0;
class MetadataStorage {
    constructor() {
        this.metadataStore = new Map();
    }
    addMetadata(metadata) {
        const target = metadata.target;
        if (!this.metadataStore.has(target)) {
            this.metadataStore.set(target, []);
        }
        this.metadataStore.get(target).push(metadata);
    }
    getMetadatasForClassInstance(classInstance) {
        const targetMetadata = this.metadataStore.get(classInstance['__proto__']) || [];
        const parentMetadata = this.metadataStore.get(classInstance['__proto__']['__proto__']) || [];
        return [...targetMetadata, ...parentMetadata];
    }
}
exports.metadataStorage = new MetadataStorage();
