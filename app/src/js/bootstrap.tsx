import * as React from 'react'
import { configure } from 'mobx'
import { CatalogAwaiter } from '@code-202/intl'
import Loader from './component/loader'
import { Routes, Route } from 'react-router'
import * as Layout from './layout'
//import { LoginPage } from './security'
import * as Navigation from './navigation'
//import RequireAuth from './security/require-auth'
//import LogoutPage from './security/logout-page'
//import PasswordTruster from './security/password-truster'
import * as Page from './page'
//import RequireUnauth from './security/require-unauth'

interface Props { }

interface State { }

configure({ enforceActions: 'observed' })

export default class Bootstrap extends React.PureComponent<Props, State> {
    render() {
        return (
            <CatalogAwaiter domain="app" fallback={Loader}>
                <Navigation.Component />
                {/*<PasswordTruster />*/}
                <Routes>
                    <Route path="/" element={<Layout.Component />} >
                        <Route path="demo" element={<Page.Demo />} />
                        {/*<Route path="/login/*" element={<LoginPage />} />
                        <Route path="/logout" element={<LogoutPage />} />
                        <Route path="/account/*" element={<RequireAuth><Page.Account /></RequireAuth>} />
                        <Route path="/signup/*" element={<RequireUnauth><Page.Signup /></RequireUnauth>} />*/}
                        <Route path="*" element={<Page.NotFound />} />
                    </Route>
                </Routes>
            </CatalogAwaiter>
        )
    }
}
