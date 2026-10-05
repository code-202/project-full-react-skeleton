import * as React from 'react'

export interface Props {
    children: JSX.Element
}

export interface State {
}

export default class Content extends React.PureComponent<Props, State> {
    render (): React.ReactNode {
        return (
            <div id="layout-content" className="h-100 flex-fill overflow-auto bg-body-tertiary">
                { this.props.children }
            </div>
        )
    }
}
