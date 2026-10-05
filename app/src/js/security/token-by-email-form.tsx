import * as React from 'react'
import { FormattedMessage } from '@code-202/intl'
import { observer } from 'mobx-react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
    Alert,
    Button,
    Form, FormGroup, FormFeedback,
    Input, InputGroup, InputGroupText,
} from 'reactstrap'
import { Link } from 'react-router'
import { Store } from './store'
import Icon from '@mdi/react'
import { mdiAt, mdiEmailArrowLeftOutline, mdiExclamationThick, mdiLoading, mdiLock, mdiLockCheck, mdiLogin } from '@mdi/js'
import { getKernel } from '@code-202/kernel'
import * as Notification from '@app/notification'

export interface Props {
    onLogin?: () => void
}

export interface State {
    error: string | false
    email: string
}

const EmailSchema = Yup.object().shape({
    email: Yup.string()
        .email('login.error.email.invalid')
        .min(2, 'login.error.too_short')
        .required('login.error.email.empty'),
})

const TokenSchema = Yup.object().shape({
    token: Yup.string()
        .min(10, 'login.error.too_short')
        .max(10, 'login.error.too_long')
        .required('login.error.token.empty'),
})

export class TokenByEmailForm extends React.Component<Props, State> {
    private security: Store
    protected firstInput: React.RefObject<HTMLInputElement | null>
    constructor(props: Props) {
        super(props)

        this.state = {
            error: false,
            email: ''
        }

        this.security = getKernel().container.get('security') as Store

        this.firstInput = React.createRef<HTMLInputElement>()
    }

    componentDidMount(): void {
        if (this.firstInput.current) {
            this.firstInput.current.focus()
        }
    }

    render(): React.ReactNode {
        if (!this.state.email) {
            return (
                <Formik
                    key="ask_token"
                    initialValues={{ email: this.state.email }}
                    validationSchema={EmailSchema}
                    validateOnBlur={false}
                    onSubmit={(values, actions) => {
                        this.setState({
                            error: false
                        })
                        this.security.requestTokenByEmail(values.email)
                            .then((response: any) => {
                                actions.setSubmitting(false)
                                this.setState({
                                    email: values.email
                                })
                            })
                            .catch((reason: any) => {
                                actions.setSubmitting(false)
                                this.setState({
                                    error: reason.data.message || 'internal'
                                })
                            })
                    }}
                >
                    {props => (
                        <Form onSubmit={props.handleSubmit} noValidate >
                            <Alert color="info" fade={false}>
                                <FormattedMessage id="login.token_by_email.ask_token.instructions" />
                            </Alert>
                            <FormGroup>
                                <InputGroup>
                                    <InputGroupText>
                                        <Icon path={mdiAt} size={1} />
                                    </InputGroupText>
                                    <Input
                                        type="email"
                                        name="email"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.email}
                                        invalid={props.errors.email !== undefined && props.touched.email}
                                        innerRef={this.firstInput}
                                    />
                                    {props.errors.email !== undefined && props.touched.email && (
                                        <FormFeedback>
                                            <FormattedMessage id={props.errors.email} />
                                        </FormFeedback>
                                    )}
                                </InputGroup>
                            </FormGroup>
                            <div className="d-flex flex-row-reverse justify-content-between align-items-center">
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="text-white ml-5"
                                    disabled={props.isSubmitting}
                                >
                                    {props.isSubmitting ? (
                                        <Icon path={mdiLoading} spin={true} size={1} className="me-2" />
                                    ) : (
                                        <Icon path={mdiEmailArrowLeftOutline} size={1} className="me-2" />
                                    )}
                                    <FormattedMessage id="login.token_by_email.ask_token.request" />
                                </Button>
                                {this.state.error && (
                                    <div className="text-danger">
                                        <Icon path={mdiExclamationThick} size={1} className="me-2" />
                                        <FormattedMessage id={`login.error.token_by_email.ask_token.${this.state.error}`} />
                                    </div>
                                )}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <Link to="/login">
                                    <FormattedMessage id="login.remember_password" />
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            )
        }

        return (
            <Formik
                key="saet_token"
                initialValues={{ token: '' }}
                validationSchema={TokenSchema}
                validateOnBlur={false}
                onSubmit={(values, actions) => {
                    this.setState({
                        error: false
                    })
                    this.security.loginByToken(this.state.email, values.token)
                        .then((response: any) => {

                            getKernel().container.get('event-dispatcher').emit('notify', {
                                title: { id: 'login.token_by_email.set_token.success.title' } as Notification.Definition.TranslationText,
                                content: <Link to="/account/username-password" className="btn btn-success">
                                    <FormattedMessage id="login.token_by_email.set_token.success.content" />
                                </Link>,
                                color: 'success',
                                icon: mdiLockCheck
                            } as Notification.Definition.Definition)

                            if (this.props.onLogin) {
                                this.props.onLogin()
                            }
                        })
                        .catch((reason: any) => {
                            actions.setSubmitting(false)

                            if (reason.data.message === 'Token has expired.') {
                                this.setState({
                                    email: '',
                                    error: 'expired'
                                })
                            } else {
                                this.setState({
                                    error: 'internal'
                                })
                            }
                        })
                }}
            >
                {props => (
                    <Form onSubmit={props.handleSubmit}>
                        <Alert color="info" fade={false}>
                            <FormattedMessage id="login.token_by_email.set_token.instructions" />
                        </Alert>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupText>
                                    <Icon path={mdiLock} size={1} />
                                </InputGroupText>
                                <Input
                                    type="text"
                                    name="token"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.token}
                                    invalid={props.errors.token !== undefined && props.touched.token}
                                    innerRef={this.firstInput}
                                />
                                {props.errors.token !== undefined && props.touched.token && (
                                    <FormFeedback>
                                        <FormattedMessage id={props.errors.token} />
                                    </FormFeedback>
                                )}
                            </InputGroup>
                        </FormGroup>
                        <div className="d-flex flex-row-reverse justify-content-between align-items-center">
                            <Button
                                type="submit"
                                color="primary"
                                className="text-white"
                                disabled={props.isSubmitting}
                            >
                                {props.isSubmitting ? (
                                    <Icon path={mdiLoading} spin={true} size={1} className="me-2" />
                                ) : (
                                    <Icon path={mdiLogin} size={1} className="me-2" />
                                )}
                                <FormattedMessage id="login.token_by_email.set_token.request" />
                            </Button>
                            {this.state.error && (
                                <div className="text-danger">
                                    <Icon path={mdiExclamationThick} size={1} className="me-2" />
                                    <FormattedMessage id={`login.error.token_by_email.token.${this.state.error}`} />
                                </div>
                            )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to="/login">
                                <FormattedMessage id="login.remember_password" />
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default observer(TokenByEmailForm)
