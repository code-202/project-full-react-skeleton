import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import Icon from '@mdi/react';
import { mdiArrowRightBoldCircle, mdiExclamationThick } from '@mdi/js';

interface Props {}

interface State {}

export default class Home extends React.PureComponent<Props, State> {
    render () {
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
