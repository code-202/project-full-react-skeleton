import { StoreContainer } from 'react-mobx-store-container'
import Manifest, { Catalog } from './manifest'
import { RemoteCatalog, LocaleStore, SimpleCatalog } from 'react-mobx-intl'
//import * as Security from './security'
//import { TokenVerifier, KeyProvider, KeyBuilder } from 'mobx-jwt'
//import moment from 'moment'
//import 'moment-timezone'

export const buildContainer = (manifestContent: Catalog = {}, env: any = {}): StoreContainer => {
    const container = new StoreContainer()

    container.addStore('container', new StoreContainer())

    const manifest = new Manifest(manifestContent, env)
    container.addStore('manifest', manifest)

    const localeStore: LocaleStore = new LocaleStore(['fr'])
    const frRc = [new RemoteCatalog('fr', manifest.get('translations/app.fr.json'), ['app'])]

    for (const rc of frRc) {
        localeStore.addCatalog(rc)
    }
    container.onInit(() => {
        localeStore.changeLocale('fr')
    })

    container.addStore('locale', localeStore)

    //moment.locale('fr')
    //moment.tz.setDefault('Europe/Paris')

    //const securityStore = new Security.Store.Store(
    //    new TokenVerifier(new KeyProvider(new KeyBuilder.SPKIBuilder(env.PUBLIC_KEY, 'RS256'))),
    //    {
    //        endpoint: env.API_ENDPOINT as string,
    //        cookieOptions: {
    //            domain: env.MAIN_DOMAIN as string,
    //        },
    //        notifyLogout: false,
    //    }
    //)

    return container
}
