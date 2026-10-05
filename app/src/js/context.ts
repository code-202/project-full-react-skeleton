export class Context {
    isNode(): boolean {
        return typeof process !== 'undefined' && process.versions != null && process.versions.node != null
    }
}

export const context = new Context()
