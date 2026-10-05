import { NavigateFunction, Location } from 'react-router'

export class Navigator {
    protected _navigate: NavigateFunction | null = null
    protected _location: Location | null = null

    public set navigate(n: NavigateFunction | null) {
        this._navigate = n
    }

    public get navigate(): NavigateFunction | null {
        return this._navigate
    }

    public set location(l: Location | null) {
        this._location = l
    }

    public get location(): Location | null {
        return this._location
    }
}
