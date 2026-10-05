import * as React from 'react'
import { FormattedMessage } from '@code-202/intl'
import { observer } from 'mobx-react'
import {
    Button,
    Card, CardBody,
    Form, FormGroup, Label, FormFeedback,
    Input, InputGroup, InputGroupText
} from 'reactstrap'
import { Store } from './store'
import { getKernel } from '@code-202/kernel'
import Icon from '@mdi/react'
import { mdiAccount, mdiExclamationThick, mdiLoading, mdiLock, mdiLogin } from '@mdi/js'
import { Navigate, Outlet, Route, Routes } from 'react-router'
import { Navigator } from '../navigation'
import UsernamePasswordFrom from './username-password-form'
import TokenByEmailForm from './token-by-email-form'

interface Props {

}

interface State {
    login: string
    password: string
    loginError: false | string
    passwordError: false | string
    rememberMe: boolean
}

class LoginPage extends React.PureComponent<Props, State> {
    private security: Store
    private navigator: Navigator

    constructor(props: Props) {
        super(props)

        this.security = getKernel().container.get('security') as Store
        this.navigator = getKernel().container.get('navigator') as Navigator

        this.state = {
            login: '',
            password: '',
            loginError: false,
            passwordError: false,
            rememberMe: false
        }
    }

    render(): React.ReactNode {
        if (this.security.connected) {
            return <Navigate to="/" replace />
        }

        return (
            <div className="vh-100 w-100 d-flex justify-content-center align-items-center flex-column text-primary">
                <Card style={{ width: 600 }}>
                    <CardBody>
                        <Routes>
                            <Route path="/" element={<Outlet />} >
                                {/*<Route key={0} path="/identity" element={<Identity />} />*/}
                                <Route key={0} path="/token-by-email" element={<TokenByEmailForm onLogin={this.onLoginHandler} />} />
                                <Route key={-1} path="" element={<UsernamePasswordFrom onLogin={this.onLoginHandler} />} />
                            </Route>
                        </Routes>
                    </CardBody>
                </Card>
            </div>
        )
    }

    protected onLoginHandler = () => {
        if (this.navigator.navigate && this.navigator.location?.state?.from) {
            this.navigator.navigate(this.navigator.location?.state?.from)
        }
    }
}

export default observer(LoginPage)
