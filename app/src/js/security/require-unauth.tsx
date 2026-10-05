import { observer } from 'mobx-react'
import { getKernel } from "@code-202/kernel";
import * as React from "react";
import { Store } from "./store";
import { Navigate } from 'react-router';

export interface Props {
    children: JSX.Element
}

export interface State {

}

class RequireUnauth extends React.PureComponent<Props, State>
{
    protected security: Store

    constructor(props: Props) {
        super(props)

        const kernel = getKernel()
        this.security = kernel.container.get('security') as Store
    }

    render () {
        if (this.security.connected) {
            return <Navigate to="/" replace={true} />
        }

        return this.props.children
    }
}

export default observer(RequireUnauth)
