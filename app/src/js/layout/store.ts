//import { CookiesManager } from "@code-202/cookie-consent"
import { action, computed, makeObservable, observable } from "mobx"
import { getKernel } from "@code-202/kernel"

export type Mode = 'light' | 'dark'
export class Store {
    protected _mode: Mode = 'light'
    protected _cookiesManager?: CookiesManager

    constructor() {
        makeObservable<Store, '_mode'>(this, {
            _mode: observable,

            mode: computed,
        })
    }

    public get mode(): Mode {
        return this._mode
    }

    public set mode(mode: Mode) {
        action(() => {
            this._mode = mode
        })()

        if (getKernel().environment.context == 'browser') {
            const att = document.createAttribute('data-bs-theme')
            att.value = this._mode
            document.body.setAttributeNode(att)
        }

        this._cookiesManager?.set('_theme', mode)
    }

    public enable(cookiesManager: CookiesManager): void {
        this._cookiesManager = cookiesManager

        const cookie = this._cookiesManager?.get('_theme')

        if (cookie) {
            this.mode = cookie
        }
    }
}
