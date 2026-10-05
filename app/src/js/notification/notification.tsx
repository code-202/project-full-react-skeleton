import * as React from 'react'
import { ToastBody, ToastHeader } from 'reactstrap'
import { observer } from 'mobx-react'
import { NotificationInfo } from './store'
import { CSSTransition } from 'react-transition-group'

export interface Props {
    notificationInfo: NotificationInfo
    onRead?: () => void
}

export interface State {
    isOpen: boolean
}

export class Notification extends React.PureComponent<Props, State> {
    protected closeInterval: NodeJS.Timeout | null = null
    protected notification: React.RefObject<HTMLDivElement | null>

    constructor(props: Props) {
        super(props)

        this.state = {
            isOpen: true
        }

        this.notification = React.createRef<HTMLDivElement>()
    }

    componentDidMount(): void {
        this.initCloseTimeout()
    }

    componentWillUnmount(): void {
        this.resetCloseTimeout()
    }

    render(): React.ReactNode {
        const { notificationInfo } = this.props

        const message = notificationInfo.message()

        return (
            <CSSTransition
                in={this.state.isOpen}
                timeout={2000}
                classNames="notification"
                appear
                onExited={this.readNotification}
                nodeRef={this.notification}
            >
                <div
                    className="notification"
                    ref={this.notification}
                >
                    <div
                        className="toast show mt-2"
                        onMouseEnter={this.onMouseEnterHandler}
                        onMouseLeave={this.onMouseLeaveHandler}
                    >
                        <ToastHeader
                            icon={message.icon}
                            toggle={this.closeNotification}
                        >
                            {message.title}
                        </ToastHeader>
                        <ToastBody>
                            {message.content}
                        </ToastBody>
                    </div>
                </div>
            </CSSTransition>
        )
    }

    protected closeNotification = (): void => {
        this.setState({
            isOpen: false
        })
    }

    protected readNotification = (): void => {
        if (this.props.onRead) {
            this.props.onRead()
        }
    }

    protected onCloseIntervalHandler = (): void => {
        this.setState({
            isOpen: false
        })
    }

    protected initCloseTimeout(): void {
        this.resetCloseTimeout()

        this.closeInterval = setTimeout(
            this.onCloseIntervalHandler,
            this.props.notificationInfo.message().important ? 60000 : 10000
        )
    }

    protected resetCloseTimeout(): void {
        if (this.closeInterval) {
            clearTimeout(this.closeInterval)
            this.closeInterval = null
        }
    }

    protected onMouseEnterHandler = (): void => {
        this.resetCloseTimeout()
    }

    protected onMouseLeaveHandler = (): void => {
        this.initCloseTimeout()
    }
}

export default observer(Notification)
