import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RemoteCatalog, LocaleStore, CatalogAwaiter } from '@code-202/intl'
import Loader from './loader'
import { getKernel, ManifestComponent } from '@code-202/kernel'

export interface Props {
    name: string
    extensions?: string[]
    children: JSX.Element
}

export interface State {

}

export class DynamicModule extends React.PureComponent<Props, State> {
    protected localeStore: LocaleStore
    protected manifest: ManifestComponent.Interface

    constructor (props: Props) {
        super(props)

        this.localeStore = getKernel().container.get('intl.locale') as LocaleStore
        this.manifest = getKernel().manifest

        const catalogs = [
            new RemoteCatalog('fr', this.manifest.get(`translations/${this.props.name}.fr.json`), [this.props.name])
        ]

        if (this.props.extensions) {
            for (const extension of this.props.extensions) {
                catalogs.push(new RemoteCatalog('fr', this.manifest.get(`translations/${this.props.name}.${extension}.fr.json`), [this.props.name + '.' + extension]))
            }
        }

        for (const rc of catalogs) {
            let missed = true
            for (const d of rc.domains) {
                if(this.localeStore.hasDomain(d)) {
                    missed = false
                }
            }

            if (missed) {
                this.localeStore.add(rc)
            }
        }
    }

    render (): React.ReactNode {

        const domains = [this.props.name]
        if (this.props.extensions) {
            for (const extension of this.props.extensions) {
                domains.push(this.props.name + '.' + extension)
            }
        }

        return (
            <CatalogAwaiter domain={domains} fallback={Loader}>
                { this.props.children }
            </CatalogAwaiter>
        )
    }
}

export default observer(DynamicModule)
