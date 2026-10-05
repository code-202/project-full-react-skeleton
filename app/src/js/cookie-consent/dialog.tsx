import * as React from 'react'
import { Dialog as Base, DialogProps } from '@code-202/cookie-consent'
import Icon from '@mdi/react'
import {  mdiCheck, mdiClose, mdiCog } from '@mdi/js'
import { LocaleStore } from '@code-202/intl'
import { getKernel } from '@code-202/kernel'
import { Alert, Badge, Collapse } from 'reactstrap'

interface Props {

}

export default class Dialog extends React.PureComponent<Props> {
    protected localeStore: LocaleStore

    constructor(props: Props) {
        super(props)

        this.localeStore = getKernel().container.get('intl.locale') as LocaleStore
    }

    render(): React.ReactNode {

        const intl = this.localeStore.intl

        const props: DialogProps = {
            className: 'modal-lg',
            header: {
                content: (store) => intl.formatMessage({id: 'app.cookie-consent.title'})
            },
            body: {
                content: (store, customizing) => <>
                    { intl.formatMessage({id: 'app.cookie-consent.description'}) }

                    { store.newServiceSinceLastConsent && (
                        <Alert color="info">
                            { intl.formatMessage({id: 'app.cookie-consent.description-new'}) }
                        </Alert>
                    )}

                    <Collapse isOpen={store.customizing}>
                        { customizing }
                    </Collapse>
                </>
            },
            footer: {
                acceptAll: {
                    content: (store) => <>
                            <Icon path={mdiCheck} size="1em" /> {this.localeStore.intl.formatMessage({id: 'app.cookie-consent.accept_all'})}
                        </>
                },
                declineAll: {
                    content: (store) => <>
                            <Icon path={mdiClose} size="1em" /> {this.localeStore.intl.formatMessage({id: 'app.cookie-consent.decline_all'})}
                        </>
                },
                customize: {
                    content: (store) => <>
                            <Icon path={mdiCog} size="1em" /> {this.localeStore.intl.formatMessage({id: 'app.cookie-consent.customize'})}
                        </>
                },
                close: {
                    content: (store) => <>
                            <Icon path={mdiClose} size="1em" /> {this.localeStore.intl.formatMessage({id: 'app.cookie-consent.close'})}
                        </>
                }
            },
            customize: {
                type: {
                    name: {
                        btn: {
                            outline: (type) => true,
                            className: (type) => 'me-2 border-0',
                        },
                        content: (type) => this.localeStore.intl.formatMessage({id: `app.cookie-consent.type.${type.id}`})
                    },
                    acceptAll: {
                        content: (type) => this.localeStore.intl.formatMessage({id: 'app.cookie-consent.accept_all'})
                    },
                    declineAll: {
                        content: (type) => this.localeStore.intl.formatMessage({id: 'app.cookie-consent.decline_all'})
                    },
                    noNeedConsent: (type) => this.localeStore.intl.formatMessage({id: 'app.cookie-consent.required'}),
                    service: {
                        className: (service) => 'd-flex justify-content-between mb-2',
                        name: (service) => <div>
                                { this.localeStore.intl.formatMessage({id: `app.cookie-consent.type.${service.type}.${service.id}`})}
                                &nbsp;:
                                { service.cookies?.map((cookie) => (
                                    <Badge className="ms-2" key={cookie}>{ cookie }</Badge>
                                ))}
                            </div>,
                        accept: {
                            content: (service) => this.localeStore.intl.formatMessage({id: 'app.cookie-consent.accept'})
                        },
                        decline: {
                            content: (service) => this.localeStore.intl.formatMessage({id: 'app.cookie-consent.decline'})
                        },
                        noNeedConsent: (service) => this.localeStore.intl.formatMessage({id: 'app.cookie-consent.required'})
                    }
                }
            }
        }

        return (
            <Base
                {...props}
            />
        )
    }
}
