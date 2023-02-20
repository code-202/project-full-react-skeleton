import * as React from 'react'
import Demo from './demo/layout'

interface Props {}

interface State {}

export default class Layout extends React.PureComponent<Props, State> {
    render () {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <Demo />
            </div>
        )
    }
}
