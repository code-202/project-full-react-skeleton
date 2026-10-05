import * as React from 'react'
import { FormattedMessage } from '@code-202/intl'

interface Props { }

interface State { }

export default class NotFound extends React.PureComponent<Props, State> {
    render(): React.ReactNode {
        return (
            <div className="vh-100 w-100 d-flex justify-content-center align-items-center flex-column">
                <div className="alert alert-warning text-center">
                    <h1>
                        <FormattedMessage id="app.404" />
                    </h1>
                </div>
            </div>
        )
    }
}
