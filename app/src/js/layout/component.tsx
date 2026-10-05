import { observer } from 'mobx-react'
import * as React from 'react'
import { Outlet } from 'react-router'
//import { Dialog } from '../cookie-consent'
import { Component as Navbar } from '../navbar'
import * as Notification from '@app/notification'

interface Props { }

interface State { }

class Component extends React.PureComponent<Props, State> {
    render() {

        return (
            <div className="vh-100 d-flex flex-column">
                <Navbar />

                <div className="flex-fill overflow-hidden position-relative">
                    <Notification.Notificator />
                    <Outlet />
                </div>

                {/*<Dialog />*/}
            </div>
        )
    }
}

export default observer(Component)
