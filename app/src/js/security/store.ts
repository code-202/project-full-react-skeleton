import { ApiRequest, Request, Response } from '@code-202/agent'
import * as Base from '@code-202/jwt'
import { TokenRequest } from '@code-202/jwt/build/token-request'
import { action, makeObservable } from 'mobx'

export interface Informations extends Base.Informations {

}

export class Store extends Base.Store<Informations> {
    protected listeners: Listener[] = []

    protected _requestToken: ApiRequest
    protected _requestValidateToken: TokenRequest

    constructor (tokenVerifier: Base.TokenVerifier, options: Base.Options) {
        super(tokenVerifier, options)

        this._requestToken = new ApiRequest(options.endpoint + '/public/authentication/ask_token', 'POST')
        this._requestToken.onStatusChange(action((status: Request.Status) => {
            this.status = status
        }))

        this._requestValidateToken = new TokenRequest(options.endpoint + '/login/email', 'POST', tokenVerifier)
        this._requestValidateToken.onStatusChange(action((status: Request.Status) => {
            this.status = status
        }))

        makeObservable (this, {
            requestTokenByEmail: action,
            loginByToken: action,
        })
    }

    public onError(listener: Listener): void {
        this.listeners.push(listener)
    }

    protected createInformations(): Informations {
        return {
            iat: 0,
            exp: 0,
            username: ''
        }
    }

    protected buildLoginData (username: string, password: string, rememberMe: boolean = false): object {
        return {
            key: username,
            password: password,
            remember_me: rememberMe
        }
    }

    public onAuthenticationError (responseStatus: any | null, responseTextStatus: any | null): void {
        super.onAuthorizationError(responseStatus, responseTextStatus)

        for (const listener of this.listeners) {
            listener(responseStatus, responseTextStatus, null)
        }
    }

    public onAccessDeniedError (responseStatus: any | null, responseTextStatus: any | null, data: any | null): void {
        for (const listener of this.listeners) {
            listener(responseStatus, responseTextStatus, data)
        }
    }

    public requestTokenByEmail (email: string): Promise<any> {
        if (this.status === 'pending') {
            return new Promise((resolve, reject) => {
                reject()
            })
        }

        return this._requestToken.send({key: email, transport: 'email'})
    }

    public loginByToken (email: string, token: string): Promise<any> {
        if (this.status === 'pending') {
            return new Promise((resolve, reject) => {
                reject()
            })
        }

        return this._requestValidateToken.send({
            key: email,
            password: token
        })
        .then((response: Response.Response) => {
            this.updateToken(response.data.token, response.data.decoded, true, false)
            return response
        })
    }

}

export type Listener = (responseStatus: any | null, responseTextStatus: any | null, data: any | null) => void
