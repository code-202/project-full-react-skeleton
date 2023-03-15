import * as React from 'react'
import { Launcher as Base } from '@code-202/cookie-consent'
import Icon from '@mdi/react';
import { mdiCookie } from '@mdi/js';

export default class Launcher extends Base {
    renderContent (): React.ReactNode {
        return (
            <small>
                <Icon path={mdiCookie} size={1} className="me-2"/>
                Gestion des cookies
            </small>
        )
    }
}
