import * as React from 'react'
import { FormattedMessage } from '@code-202/intl'
import { Link } from 'react-router-dom'
import Icon from '@mdi/react';
import { mdiArrowRightBoldCircle, mdiExclamationThick } from '@mdi/js';

interface Props {}

interface State {}

export default class Home extends React.PureComponent<Props, State> {
    render (): React.ReactNode {
        return (
            <>
                <div className="alert alert-success text-center">
                    <h1>
                        <Icon path={mdiExclamationThick} spin={-2} size={1} className="me-2" />

                        <FormattedMessage id="app.welcome" />

                        <Icon path={mdiExclamationThick} spin={2} size={1} className="ms-2" />
                    </h1>
                </div>
                <Link to="/about">
                    <Icon path={mdiArrowRightBoldCircle} size={1} />
                </Link>
            </>
        )
    }
}
