import { StoreContainer } from 'react-mobx-store-container'
import Manifest, { Catalog } from './manifest'
import { RemoteCatalog, LocaleStore, SimpleCatalog } from 'react-mobx-intl'

export const Container = (manifestContent: Catalog = {}) => {
    const container = new StoreContainer()

    container.addStore('container', new StoreContainer())

    const manifest = new Manifest(manifestContent)
    container.addStore('manifest', manifest)

    const localeStore: LocaleStore = new LocaleStore(['fr'])
    const frRc = [new RemoteCatalog('fr', manifest.get('translations/app.fr.json'), ['app'])]

    for (const rc of frRc) {
        localeStore.addCatalog(rc)
    }
    localeStore.changeLocale('fr')

    container.addStore('locale', localeStore)

    return container
}
