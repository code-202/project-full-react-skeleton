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

interface Props {

}

interface State {
    login: string
    password: string
    loginError: false | string
    passwordError: false | string
    rememberMe: boolean
}

class LoginPage extends React.Component<Props, State> {
    private security: Store
    protected loginInput: React.RefObject<HTMLInputElement>

    constructor (props: Props) {
        super(props)

        this.security = getKernel().container.get('security') as Store

        this.state = {
            login: '',
            password: '',
            loginError: false,
            passwordError: false,
            rememberMe: false
        }

        this.loginInput = React.createRef<HTMLInputElement>()
    }

    componentDidMount() {
        if (this.loginInput.current) {
            this.loginInput.current.focus()
        }
    }

    render () {
        if (this.security.connected) {
            return null
        }

        return (
            <div className="vh-100 w-100 d-flex justify-content-center align-items-center flex-column text-primary bg-light">
                <Card style={{ minWidth: 600 }}>
                    <CardBody>
                        <Form
                            onSubmit={this.onSubmitHandler}
                        >
                             <FormGroup>
                                <InputGroup>
                                    <InputGroupText>
                                        <Icon path={mdiAccount} size={1} />
                                    </InputGroupText>
                                    <Input
                                        type="text"
                                        name="login"
                                        onChange={this.onChangeLoginHandler}
                                        invalid={this.state.loginError !== false}
                                        innerRef={this.loginInput}
                                        />
                                    { this.state.loginError !== false && (
                                        <FormFeedback>
                                            <FormattedMessage id={this.state.loginError} />
                                        </FormFeedback>
                                    )}
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup>
                                    <InputGroupText>
                                        <Icon path={mdiLock} size={1} />
                                    </InputGroupText>
                                    <Input
                                        type="password"
                                        name="password"
                                        onChange={this.onChangePasswordHandler}
                                        invalid={this.state.passwordError !== false}
                                        />
                                    { this.state.passwordError !== false && (
                                        <FormFeedback>
                                            <FormattedMessage id={this.state.passwordError} />
                                        </FormFeedback>
                                    )}
                                </InputGroup>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        type="checkbox"
                                        name="remember_me"
                                        onChange={this.onChangeRememberMeHandler}
                                    />{' '}
                                    <FormattedMessage id="login.remember_me" />
                                </Label>
                            </FormGroup>
                            <div className="d-flex flex-row-reverse justify-content-between align-items-center">
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="text-white"
                                    disabled={this.security.status === 'pending'}
                                >
                                    { this.security.status === 'pending' ? (
                                        <Icon path={mdiLoading} size={1} spin={1} className="me-2" />
                                    ) : (
                                        <Icon path={mdiLogin} size={1} className="me-2" />
                                    )}
                                    <FormattedMessage id="login.send" />
                                </Button>
                                { this.security.status === 'error' && (
                                    <div className="text-danger">
                                        <Icon path={mdiExclamationThick} size={1} className="me-2" />
                                        <FormattedMessage id="login.error" />
                                    </div>
                                )}
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        )
    }

    public onChangeLoginHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            login: event.target.value
        })
    }

    public onChangePasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            password: event.target.value
        })
    }

    public onChangeRememberMeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            rememberMe: event.target.checked
        })
    }

    public onSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault()

        const s: State = Object.assign({}, this.state)

        if (s.login.length === 0) {
            s.loginError = 'login.error.login.empty'
        } else {
            s.loginError = false
        }

        if (s.password.length === 0) {
            s.passwordError = 'login.error.password.empty'
        } else {
            s.passwordError = false
        }

        this.setState(s)

        if (!s.loginError && !s.passwordError) {
            this.security.login(s.login, s.password, s.rememberMe)
        }
    }
}

export default observer(LoginPage)
