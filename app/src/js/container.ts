import { LocaleStore, RemoteCatalog } from '@code-202/intl'
import { Kernel, getKernel } from '@code-202/kernel'
//import * as Security from './security'
//import { TokenVerifier, KeyProvider, KeyBuilder } from '@code-202/jwt'
//import * as moment from 'moment'
//import 'moment-timezone'
//import { CookiesManager, Store as CookieConsentStore } from '@code-202/cookie-consent'
import * as Navbar from './navbar'
import * as Navigation from './navigation'
import * as Layout from './layout'
import { Store as NotificationStore } from './notification'
import EventEmitter from 'eventemitter3'

export const buildContainer = (req: { cookies?: string }): void => {
    const kernel = getKernel()

    const eventDispatcher = new EventEmitter()
    kernel.container.add('event-dispatcher', eventDispatcher)

    const localeStore: LocaleStore = new LocaleStore(['fr'])

    localeStore.add(new RemoteCatalog('fr', kernel.manifest.get('translations/app.fr.json', true), ['app']))
    //localeStore.add(new RemoteCatalog('fr', kernel.manifest.get('translations/security.fr.json', true), ['security']))

    kernel.container.onInit(() => {
        localeStore.changeLocale('fr').catch((err) => console.error(err))
    })

    kernel.container.add('intl.locale', localeStore)

    kernel.container.add('layout', new Layout.Store.Store())

    //moment.locale('fr')
    //moment.tz.setDefault('Europe/Paris')

    //const securityStore = configureSecurity(kernel)

    //configureCookieConsent(kernel, req.cookies)

    kernel.container.add('navbar', new Navbar.Store.Store())
    kernel.container.add('navigator', new Navigation.Navigator())

    const notificationStore = new NotificationStore.Store()
    kernel.container.add('notification', notificationStore)

    //kernel.container.add('access-denied-listener', new Security.AccessDeniedListener.Listener(securityStore, eventDispatcher))
}

/*const configureSecurity = (kernel: Kernel): Security.Store.Store => {
    const securityStore = new Security.Store.Store(
        new TokenVerifier(new KeyProvider(new KeyBuilder.SPKIBuilder(kernel.environment.get('PUBLIC_KEY') as string, 'RS256'))),
        {
            endpoint: kernel.environment.get('API_ENDPOINT') as string,
            cookieOptions: {
                domain: kernel.environment.get('MAIN_DOMAIN') as string,
            },
            notifyLogout: true,
            urls: {
                login: '/login/username',
                refreshToken: '/security/jwt/refresh',
                logout: '/security/logout',
            }
        }
    )
    kernel.container.add('security', securityStore)

    return securityStore
}*/

/*const configureCookieConsent = (kernel: Kernel, cookies?: string) => {
    const cookieConsentStore = new CookieConsentStore({ cookie: { secure: false }, customizable: true }, cookies)

    cookieConsentStore.addService({
        id: 'cookie-consent',
        needConsent: false,
        type: 'main',
        cookies: ['_cc']
    })

    cookieConsentStore.addService({
        id: 'security',
        needConsent: false,
        type: 'main',
        cookies: ['api-token']
    })

    cookieConsentStore.addService({
        id: 'theme',
        needConsent: true,
        type: 'ergonomics',
        name: 'Thème',
        cookies: ['_theme'],
        onAccept: (cookiesManager: CookiesManager) => {
            (kernel.container.get('layout') as Layout.Store.Store)?.enable(cookiesManager)
        }
    })

    kernel.container.add('cookie-consent', cookieConsentStore)

    kernel.container.onInit(() => {
        cookieConsentStore.initialize()
    })
}*/
