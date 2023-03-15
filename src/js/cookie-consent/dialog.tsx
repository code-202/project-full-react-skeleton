import * as React from 'react'
import { Dialog as Base, Store } from '@code-202/cookie-consent'
import Icon from '@mdi/react';
import {  mdiCheck, mdiClose } from '@mdi/js';

export default class Dialog extends Base {

    renderModalHeader (): React.ReactNode {
        return 'Votre choix'
    }

    renderModalBody (): React.ReactNode {
        return 'Ce site utilise des cookies afin de vous faire profiter d\'une navigation optimale'
    }

    renderButtonAcceptAll (): React.ReactNode {
        return <>
            <Icon path={mdiCheck} size="1em" /> Tout accepter
        </>
    }

    renderButtonDeclineAll (): React.ReactNode {
        return <>
            <Icon path={mdiClose} size="1em" /> Tout refuser
        </>
    }
}
