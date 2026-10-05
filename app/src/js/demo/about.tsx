import * as React from 'react'
import { FormattedMessage } from '@code-202/intl'
import { Link } from 'react-router-dom'
import Icon from '@mdi/react';
import { mdiArrowLeftBoldCircle } from '@mdi/js';

interface Props {}

interface State {}

export default class About extends React.PureComponent<Props, State> {
    render () {
        return (
            <>
                <div className="alert alert-warning text-center">
                    <h1>
                        <FormattedMessage id="app.about" />
                    </h1>
                </div>
                <Link to="/">
                    <Icon path={mdiArrowLeftBoldCircle} size={1} />
                </Link>
            </>
        )
    }
}
