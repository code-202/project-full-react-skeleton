import * as React from 'react'
import { observable, action, makeObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'

export class Store {
    public notifications: NotificationInfo[] = []

    public constructor () {
        makeObservable(this, {
            notifications: observable,

            addNotification: action,
            closeNotification: action,
        })
    }

    public addNotification (message: NotificationMessage): void {
        const notification: NotificationInfo = {
            message: () => message,
            uuid: uuidv4(),
            createdAt: new Date()
        }

        this.notifications.push(notification)
    }

    public closeNotification (uuid: string): void {
        const index = this.indexOf(uuid)

        if (index >= 0) {
            this.notifications.splice(index, 1)
        }
    }

    protected indexOf (uuid: string): number {
        for (const index in this.notifications) {
            if (this.notifications[index].uuid === uuid) {
                return parseInt(index, 10)
            }
        }

        return -1
    }
}

export interface NotificationInfo {
    message: () => NotificationMessage
    uuid: string
    createdAt: Date
    closedAt?: Date
}

export interface NotificationMessage {
    title: string | React.ReactNode
    content: string | React.ReactNode
    icon?: React.ReactNode
    important?: boolean
    type?: string
    data?: Data[]
}

export interface Data {
    [id: string]: string
}