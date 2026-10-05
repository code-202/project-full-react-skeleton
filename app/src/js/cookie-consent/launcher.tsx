import * as React from 'react'
import { Launcher as Base } from '@code-202/cookie-consent'
import Icon from '@mdi/react';
import { mdiCookie } from '@mdi/js';

export default class Launcher extends React.PureComponent {
    render (): React.ReactNode {
        return (
            <Base
                className='cookie-content-launcher-btn border-0 text-white'
                content={(store) => <Icon path={mdiCookie} size={1}/> }
            />
        )
    }
}
