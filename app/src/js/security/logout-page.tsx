import * as React from 'react'
import { observer } from 'mobx-react'
import { Navigate } from 'react-router'
import { getKernel } from '@code-202/kernel'
import { Store } from './store'

export interface Props {

}

export interface State {

}

export class LogoutPage extends React.PureComponent<Props, State> {
    private security: Store

    constructor (props: Props) {
        super(props)

        this.security = getKernel().container.get('security') as Store
    }

    componentDidMount(): void {
        this.security.logout()
    }

    render (): React.ReactNode {
        if (!this.security.connected) {
            return <Navigate to="/" />
        }

        return null
    }
}

export default observer(LogoutPage)
