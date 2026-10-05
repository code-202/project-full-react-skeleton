import * as React from 'react'
import { observer } from 'mobx-react'
import { getKernel } from '@code-202/kernel'
import { Store, NotificationInfo } from './store'
import Notification from './notification'
import Factory from './factory'

export interface Props { }

export interface State { }

export class Notificator extends React.PureComponent<Props, State> {
    private notificationStore: Store
    private factory: Factory

    public constructor(props: Props) {
        super(props)

        this.notificationStore = getKernel().container.get('notification') as Store
        this.factory = new Factory()
    }

    render(): React.ReactNode {
        return (
            <div className="toast-container">
                {this.notificationStore.notifications.map((notificationInfo: NotificationInfo) => (
                    <Notification
                        key={notificationInfo.uuid}
                        notificationInfo={notificationInfo}
                        onRead={() => this.notificationStore.closeNotification(notificationInfo.uuid)}
                    />
                ))}
            </div>
        )
    }
}

export default observer(Notificator)
