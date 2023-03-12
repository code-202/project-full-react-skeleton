import * as React from 'react'
import { configure } from 'mobx'
import { MobxIntlProvider } from '@code-202/intl'
import Layout from './layout'

interface Props {}

interface State {}

configure({ enforceActions: 'observed' })

export default class Bootstrap extends React.PureComponent<Props, State> {
    render () {
        return (
            <MobxIntlProvider domain="app">
                <Layout />
            </MobxIntlProvider>
        )
    }
}
