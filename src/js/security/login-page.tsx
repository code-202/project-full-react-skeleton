import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { observer, inject } from 'mobx-react'
import {
    Button,
    Card, CardFooter, CardBody, CardHeader,
    Form, FormGroup, Label, FormFeedback,
    Input, InputGroup, InputGroupText
} from 'reactstrap'
import { Store } from './store'

interface Props {
    security?: Store
}

interface State {
    login: string
    password: string
    loginError: false | string
    passwordError: false | string
    rememberMe: boolean
}

class LoginPage extends React.Component<Props, State> {
    protected loginInput: React.RefObject<HTMLInputElement>
    constructor (props: Props) {
        super(props)

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
        const { security } = this.props

        if (!security || security.connected) {
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
                                        <i className="mdi mdi-account"></i>
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
                                        <i className="mdi mdi-lock"></i>
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
                                    disabled={security.status === 'pending'}
                                >
                                    { security.status === 'pending' ? (
                                        <i className="mdi mdi-loading mdi-spin me-2"></i>
                                    ) : (
                                        <i className="mdi mdi-login me-2"></i>
                                    )}
                                    <FormattedMessage id="login.send" />
                                </Button>
                                { security.status === 'error' && (
                                    <div className="text-danger">
                                        <i className="mdi mdi-exclamation-thick me-2"></i>
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
            s.loginError = 'login.error.login_empty'
        } else {
            s.loginError = false
        }

        if (s.password.length === 0) {
            s.passwordError = 'login.error.password_empty'
        } else {
            s.passwordError = false
        }

        this.setState(s)

        if (!s.loginError && !s.passwordError && this.props.security) {
            this.props.security.login(s.login, s.password, s.rememberMe)
        }
    }
}

export default inject('security')(observer(LoginPage))