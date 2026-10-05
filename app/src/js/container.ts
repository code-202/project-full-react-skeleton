import { LocaleStore, RemoteCatalog } from '@code-202/intl'
import { Kernel, getKernel } from '@code-202/kernel'
//import * as Security from './security'
//import { TokenVerifier, KeyProvider, KeyBuilder } from '@code-202/jwt'
//import moment from 'moment'
//import 'moment-timezone'
//import { Store as CookieConsentStore } from '@code-202/cookie-consent'

export const buildContainer = (req: { cookies?: string }): void => {
    const kernel = getKernel()

    const localeStore: LocaleStore = new LocaleStore(['fr'])

    localeStore.add(new RemoteCatalog('fr', kernel.manifest.get('translations/app.fr.json', true), ['app']))
    //localeStore.add(new RemoteCatalog('fr', kernel.manifest.get('translations/security.fr.json', true), ['security']))

    kernel.container.onInit(() => {
        localeStore.changeLocale('fr').catch((err) => console.error(err))
    })

    kernel.container.add('intl.locale', localeStore)

    //moment.locale('fr')
    //moment.tz.setDefault('Europe/Paris')

    //configureSecurity(kernel)

    //configureCookieConsent(kernel, req.cookies)
}

/*const configureSecurity = (kernel: Kernel) => {
    const securityStore = new Security.Store.Store(
        new TokenVerifier(new KeyProvider(new KeyBuilder.SPKIBuilder(kernel.environment.get('PUBLIC_KEY') as string, 'RS256'))),
        {
            endpoint: kernel.environment.get('API_ENDPOINT') as string,
            cookieOptions: {
                domain: kernel.environment.get('MAIN_DOMAIN') as string,
            },
            notifyLogout: false,
        }
    )
    kernel.container.add('security', securityStore)
}*/

/*const configureCookieConsent = (kernel: Kernel, cookies?: string) => {
    const cookieConsentStore = new CookieConsentStore({ cookie: { secure: false }}, cookies)

    cookieConsentStore.addService({
        id: 'main',
        needConsent: false,
        type: 'main',
        name: 'Fonctionnement',
        cookies: ['rmcc', 'api-token']
    })

    cookieConsentStore.addService({
        id: 'ga',
        needConsent: true,
        type: 'analytics',
        name: 'Google Analytics',
        cookies: ['_ga', '_gid'],
        onAccept: () => {
            console.log('enable GA')
            //ga.enable()
        },
        onDecline: () => {
            console.log('disable GA')
            //ga.disable()
        }
    })

    kernel.container.add('cookie-consent', cookieConsentStore)

    kernel.container.onInit(() => {
        cookieConsentStore.initialize()
    })
}*/
