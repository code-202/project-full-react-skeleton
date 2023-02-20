export interface Catalog {
    [id: string]: string
}

export default class Manifest {
    protected _data: Catalog
    protected endpoint : string = ''

    constructor (data: Catalog, env: any = {}) {
        this._data = data

        if (env.ENDPOINT) {
            this.endpoint = env.ENDPOINT
        }
    }

    public get (key: string, absolute: boolean = true): string
    {
        return (absolute ? this.endpoint : '') + this._data[key]
    }
}
