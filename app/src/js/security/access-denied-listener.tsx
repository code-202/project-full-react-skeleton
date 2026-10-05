import { Definition } from "@app/notification";
import { Store } from "./store";
import { mdiCancel } from '@mdi/js';
import { action, makeObservable, observable } from 'mobx';
import { ApiRequest, Response } from '@code-202/agent';
import { CustomLoader } from '@code-202/loader';
import EventEmitter from 'eventemitter3';

export class Listener {

    protected security: Store
    private eventDispatcher: EventEmitter
    protected retryAfterTrust: (() => void)[] = []

    public trusterIsOpen: boolean = false

    protected _trustRequest: ApiRequest
    public trustLoader: CustomLoader

    constructor(security: Store, eventDispatcher: EventEmitter) {
        this.security = security
        this.eventDispatcher = eventDispatcher

        makeObservable(this, {
            trusterIsOpen: observable,
            trustLoader: observable,

            closeTruster: action,
        })

        this._trustRequest = new ApiRequest(this.security.endpoint + '/security/sessions/{uuid}/trust', 'PUT')
        this._trustRequest.addAuthorizationService(this.security)
        this.trustLoader = new CustomLoader(this._trustRequest, false)

        this.security.onError((responseStatus: any | null, responseTextStatus: any | null, data: any | null) => {
            if (responseStatus === 403) {
                this.eventDispatcher.emit('notify', {
                    title: { id: 'security.access-denied.title' } as Definition.TranslationText,
                    content: { id: 'security.access-denied.content' } as Definition.TranslationText,
                    color: 'danger',
                    icon: mdiCancel
                } as Definition.Definition)

                if (data.security && data.security.indexOf('SECURITY.SESSION.TRUSTED') >= 0) {
                    this.retryAfterTrust.splice(0)

                    action(() => {
                        this.trusterIsOpen = true
                    })()
                }
            }
        })
    }

    public addRetryAfterTrust(callback: () => void) {
        this.retryAfterTrust.push(callback)
    }

    public closeTruster() {
        this.trusterIsOpen = false
    }

    public tryToTrust(values: { password: string }): Promise<any> {
        if (this._trustRequest.status !== 'pending' && this.security.informations.username) {

            return this._trustRequest
                .setUrlParam('uuid', this.security.informations.username)
                .send({
                    password: values.password
                })
                .then(action((response: Response.Response) => {
                    for (const callback of this.retryAfterTrust) {
                        callback();
                    }

                    action(() => {
                        this.trusterIsOpen = false
                    })()
                }))
        }
        return new Promise((resolve, reject) => {
            reject()
        })
    }
}
