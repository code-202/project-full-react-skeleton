import * as React from 'react'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'
import { StoreContainer } from 'react-mobx-store-container'
import { MobxIntlProvider } from 'react-mobx-intl'
import Layout from './layout'

interface Props {
    container: StoreContainer
}

interface State {}

configure({ enforceActions: 'observed' })

export default class Bootstrap extends React.PureComponent<Props, State> {
    render () {
        return (
            <Provider {...this.props.container.stores}>
                <MobxIntlProvider domain="app">
                    <Layout />
                </MobxIntlProvider>
            </Provider>
        )
    }
}
