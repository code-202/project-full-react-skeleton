import * as React from 'react'
import { configure } from 'mobx'
import { CatalogAwaiter } from '@code-202/intl'
import Layout from './layout'

interface Props {}

interface State {}

configure({ enforceActions: 'observed' })

export default class Bootstrap extends React.PureComponent<Props, State> {
    render () {
        return (
            <CatalogAwaiter domain="app">
                <Layout />
            </CatalogAwaiter>
        )
    }
}
