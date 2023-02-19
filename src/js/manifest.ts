export interface Catalog {
    [id: string]: string
}

export default class Manifest {
    protected _data: Catalog

    constructor (data: Catalog) {
        this._data = data
    }

    public get (key: string, absolute: boolean = true): string
    {

        return (absolute && process.env.ENDPOINT ? process.env.ENDPOINT : '') + this._data[key]
    }
}
