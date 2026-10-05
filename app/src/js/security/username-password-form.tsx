import * as React from 'react'
import { FormattedMessage } from '@code-202/intl'
import { observer } from 'mobx-react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
    Button,
    Form, FormGroup, Label, FormFeedback,
    Input, InputGroup, InputGroupText,
} from 'reactstrap'
import { Link } from 'react-router'
import { Store } from './store'
import { getKernel } from '@code-202/kernel'
import Icon from '@mdi/react'
import { mdiAccount, mdiExclamationThick, mdiLoading, mdiLock, mdiLogin } from '@mdi/js'

export interface Props {
    onLogin?: () => void
}

export interface State {
    hasError: boolean
}

const SigninSchema = Yup.object().shape({
    login: Yup.string()
        .min(2, 'login.error.too_short')
        .required('login.error.login.empty'),
    password: Yup.string()
        .min(2, 'login.error.too_short')
        .required('login.error.password.empty'),
    rememberMe: Yup.boolean(),
})

export class UsernamePasswordForm extends React.Component<Props, State> {
    private security: Store
    protected loginInput: React.RefObject<HTMLInputElement>
    constructor (props: Props) {
        super(props)

        this.state = {
            hasError: false
        }

        this.security = getKernel().container.get('security') as Store

        this.loginInput = React.createRef<HTMLInputElement>()
    }

    componentDidMount(): void {
        if (this.loginInput.current) {
            this.loginInput.current.focus()
        }
    }

    render (): React.ReactNode {
        return (
            <Formik
                initialValues={{ login: '', password: '', rememberMe: false }}
                validationSchema={SigninSchema}
                validateOnBlur={false}
                onSubmit={(values, actions) => {
                    this.setState({
                        hasError: false
                    })
                    this.security.login(values.login, values.password, values.rememberMe)
                        .then((response: any) => {
                            if (this.props.onLogin) {
                                this.props.onLogin()
                            }
                        })
                        .catch ((reason: any) => {
                            this.setState({
                                hasError: true
                            })
                            actions.setSubmitting(false)
                        })
                }}
            >
                {props => (
                    <Form onSubmit={props.handleSubmit}>
                         <FormGroup>
                            <InputGroup>
                                <InputGroupText>
                                    <Icon path={mdiAccount} size={1} />
                                </InputGroupText>
                                <Input
                                    type="text"
                                    name="login"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.login}
                                    invalid={props.errors.login !== undefined && props.touched.login}
                                    innerRef={this.loginInput}
                                    />
                                { props.errors.login !== undefined && props.touched.login && (
                                    <FormFeedback>
                                        <FormattedMessage id={props.errors.login} />
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
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.password}
                                    invalid={props.errors.password !== undefined && props.touched.password}
                                    />
                                { props.errors.password !== undefined && props.touched.password && (
                                    <FormFeedback>
                                        <FormattedMessage id={props.errors.password} />
                                    </FormFeedback>
                                )}
                            </InputGroup>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="rememberMe"
                                    onChange={props.handleChange}
                                />{' '}
                                <FormattedMessage id="login.remember_me" />
                            </Label>
                        </FormGroup>
                        <div className="d-flex flex-row-reverse justify-content-between align-items-center">
                            <Button
                                type="submit"
                                color="primary"
                                className="text-white ml-5"
                                disabled={props.isSubmitting}
                            >
                                { props.isSubmitting ? (
                                    <Icon path={mdiLoading} spin={true} size={1} className="me-2" />
                                ) : (
                                    <Icon path={mdiLogin} size={1} className="me-2" />
                                )}
                                <FormattedMessage id="login.send" />
                            </Button>
                            { this.state.hasError && (
                                <div className="text-danger">
                                    <Icon path={mdiExclamationThick} size={1} className="me-2" />
                                    <FormattedMessage id="login.error.username_password" />
                                </div>
                            )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <Link to="/login/token-by-email">
                                <FormattedMessage id="login.forgot_password" />
                            </Link>
                            <Link to="/signup">
                                <FormattedMessage id="login.suggestions.create_account.title" />
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default observer(UsernamePasswordForm)
