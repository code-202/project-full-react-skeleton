import { LocaleStore, RemoteCatalog } from '@code-202/intl'
import { getKernel } from '@code-202/kernel'
//import * as Security from './security'
//import { TokenVerifier, KeyProvider, KeyBuilder } from 'mobx-jwt'
//import moment from 'moment'
//import 'moment-timezone'

export const buildContainer = (): void => {
    const kernel = getKernel()

    const localeStore: LocaleStore = new LocaleStore(['fr'])

    localeStore.addCatalog(new RemoteCatalog('fr', kernel.manifest.get('translations/app.fr.json', true), ['app']))

    kernel.container.onInit(() => {
        localeStore.changeLocale('fr').catch((err) => console.error(err))
    })

    kernel.container.add('intl.locale', localeStore)

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
    //kernel.container.add(securityStore)
}
