import * as React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {}

interface State {}

export default class Layout extends React.PureComponent<Props, State> {
    render () {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="alert alert-success text-center">
                    <h1>
                        <i className="mdi mdi-exclamation-thick mdi-spin mr-2"></i>

                        <FormattedMessage id="app.welcome" />

                        <i className="mdi mdi-exclamation-thick mdi-spin mr-2"></i>
                    </h1>
                </div>
            </div>
        )
    }
}
