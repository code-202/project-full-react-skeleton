import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import { FormattedMessage } from '@code-202/intl'
import { Button } from 'reactstrap'
import Icon from '@mdi/react'
import { mdiChevronDoubleLeft, mdiMenu } from '@mdi/js'

export interface Props {
    children: JSX.Element[]
}

export interface State {
    navigationIsOpen: boolean
}

export default class Sidebar extends React.PureComponent<Props, State> {
    constructor (props: Props) {
        super(props)

        this.state = {
            navigationIsOpen: true
        }
    }

    render (): React.ReactNode {

        const childrenWithOnClock = React.Children.map(this.props.children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                    onClick: () => {
                        if (window.innerWidth < 768) {
                            this.toggle()
                        }
                    }
                })
            }

            return child
        })

        return (
            <CSSTransition in={this.state.navigationIsOpen} timeout={500} classNames="sidebar">
                <div id="layout-sidebar" className="sidebar h-100 float-start">
                    <div className="h-100 border-end sidebar-content d-flex flex-column justify-content-between bg-body-tertiary">
                        <div className="list-group list-group-flush">
                            { childrenWithOnClock }
                        </div>
                        <div className="list-group list-group-flush border-top">
                            <div
                                className="list-group-item-action list-group-item"
                                onClick={this.toggle}
                            >
                                <Icon path={mdiChevronDoubleLeft} className="me-2 sidebar-icon sidebar-collapse" size={1} />
                                <span className="sidebar-item">
                                    <FormattedMessage id="app.sidebar.hide" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="sidebar-overlay vw-100 h-100"
                        onClick={this.toggle}
                        />
                    <div className="sidebar-trigger">
                        <div className="sidebar-trigger-wrapper">
                            <Button
                                color="primary"
                                onClick={this.toggle}
                                className="sidebar-trigger-toggle m-2"
                            >
                                <Icon path={mdiMenu} size={1} />
                            </Button>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }

    protected toggle = (): void => {
        this.setState({
            navigationIsOpen: !this.state.navigationIsOpen
        })
    }
}
