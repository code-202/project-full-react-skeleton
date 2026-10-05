import { FormattedMessage } from "@code-202/intl";
import { getKernel } from "@code-202/kernel";
import { Response } from '@code-202/agent'
import { observer } from "mobx-react";
import * as React from "react";
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { AccessDeniedListener } from ".";
import * as Yup from 'yup'
import { Formik } from "formik";
import Icon from "@mdi/react";
import { mdiChevronRight, mdiLoading } from "@mdi/js";

const TrustSchema = Yup.object().shape({
    password: Yup.string()
        .required('account.error.common.required'),
})

class PasswordTruster extends React.PureComponent<any, any>
{
    protected listener: AccessDeniedListener.Listener

    public constructor(props: any) {
        super(props)

        this.listener = getKernel().container.get('access-denied-listener') as AccessDeniedListener.Listener
    }

    public render(): React.ReactNode {
        return <Modal
                isOpen={this.listener.trusterIsOpen}
                toggle={this.close}
                centered={true}
                >
            <ModalHeader toggle={this.close}>
                <FormattedMessage id="security.access-denied.truster.title" />
            </ModalHeader>
            <Formik
                initialValues={{
                    password: '' //this.listener.password
                }}
                validationSchema={TrustSchema}
                validateOnBlur={false}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        actions.setSubmitting(false)
                        actions.resetForm()
                    }, 2000)

                    this.listener.tryToTrust(values)
                        .then((response: Response.Response) => {
                            actions.setSubmitting(false)
                            actions.resetForm()
                        })
                        .catch((response: Response.Response) => {
                            actions.setSubmitting(false)

                            if (/^password_/.test(response.data.message)) {
                                actions.setFieldError('password', `security.access-denied.truster.error.${response.data.message}`)
                            }
                        })
                }}
            >
                {props => (
                    <Form onSubmit={props.handleSubmit}>
                        <ModalBody>
                            <FormattedMessage id="security.access-denied.truster.content" />
                            <FormGroup>
                                <Label for="password">
                                    <FormattedMessage id="security.access-denied.truster.password.label" />
                                </Label>
                                <Input
                                    type="password"
                                    name="password"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.password}
                                    valid={props.errors.password === undefined && props.touched.password}
                                    invalid={props.errors.password !== undefined && props.touched.password}
                                    />
                                { props.errors.password !== undefined && props.touched.password && (
                                    <FormFeedback>
                                        <FormattedMessage id={props.errors.password} />
                                    </FormFeedback>
                                )}
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.close}>
                                <FormattedMessage id="security.access-denied.truster.cancel" />
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                disabled={props.isSubmitting}
                                >
                                { props.isSubmitting ? (
                                    <Icon path={mdiLoading} size={1} spin={true} className="me-2" />
                                ) : (
                                    <Icon path={mdiChevronRight} size={1} className="me-2" />
                                )}
                                <FormattedMessage id="security.access-denied.truster.trust" />
                            </Button>
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    }

    protected close = () => {
        this.listener.closeTruster()
    }
}

export default observer(PasswordTruster)
