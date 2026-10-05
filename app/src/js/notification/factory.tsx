import * as React from 'react'
import { getKernel } from '@code-202/kernel'
import { Store, NotificationMessage } from './store'
import EventEmitter from 'eventemitter3'
import Icon from '@mdi/react'
import { Definition, Text } from './definition'
import Message from './message'

export interface Props { }

export interface State { }

export default class Factory {
    private notificationStore: Store
    private eventDispatcher: EventEmitter

    public constructor() {
        this.notificationStore = getKernel().container.get('notification') as Store
        this.eventDispatcher = getKernel().container.get('event-dispatcher') as EventEmitter

        this.eventDispatcher.addListener('notify', this.create)
    }

    public create = (definition: Definition) => {
        const message: NotificationMessage = {
            title: <Message text={definition.title} />,
            content: React.isValidElement(definition.content) ? definition.content : <Message text={definition.content as Text} />,
            important: definition.important || false
        }

        if (definition.icon) {
            message.icon = <Icon path={definition.icon} className={definition.color ? `text-${definition.color}` : ''} size={1} />
        }
        this.notificationStore.addNotification(message)
    }

}

