import * as Base from '@code-202/jwt'

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

