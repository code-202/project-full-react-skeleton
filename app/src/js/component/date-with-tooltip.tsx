import * as React from 'react'
//import Moment from 'react-moment'
//import { Tooltip } from 'reactstrap'

export interface Props {
    children: Date
    suffix?: boolean
}

export interface State {
    isOpen: boolean
}

export default class DateWithTooltip extends React.PureComponent<Props, State> {
    protected id: string
    constructor(props: Props) {
        super(props)

        this.id = 'tooltip_' + Math.round(Math.random() * 1000000000)

        this.state = {
            isOpen: false
        }
    }

    render(): React.ReactNode {
        return null
        /*return (
            <>
                <span
                    id={this.id}
                >
                    <Moment
                        fromNow
                        ago={this.props.suffix === false}
                        >
                        { this.props.children }
                    </Moment>
                </span>
                <Tooltip
                    isOpen={this.state.isOpen}
                    target={this.id}
                    toggle={this.toggle}
                >
                    <Moment
                        format="D MMM YYYY HH:mm:ss"
                        >
                        { this.props.children }
                    </Moment>
                </Tooltip>
            </>
        )*/
    }

    protected toggle = (): void => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
}
