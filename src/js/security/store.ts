import * as Base from 'mobx-jwt'
import { action } from 'mobx'

export interface Informations extends Base.Informations {

}

export class Store extends Base.Store<Informations> {
    protected createInformations(): Informations {
        return {
            iat: 0,
            exp: 0,
            username: ''
        }
    }
}

