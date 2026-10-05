import { observer } from 'mobx-react'
import { FormattedMessage } from "@code-202/intl";
import { getKernel } from "@code-202/kernel";
import { mdiLockAlertOutline } from "@mdi/js";
import Icon from "@mdi/react";
import * as React from "react";
import { Alert } from "reactstrap";
import { context } from "../context";
import { Navigator } from "../navigation";
import { Store } from "./store";

export interface Props {
    children: JSX.Element
}

export interface State {

}

class RequireAuth extends React.PureComponent<Props, State> {
    protected security: Store
    protected navigator: Navigator

    constructor(props: Props) {
        super(props)

        const kernel = getKernel()
        this.security = kernel.container.get('security') as Store
        this.navigator = kernel.container.get('navigator') as Navigator
    }

    render() {
        if (!this.security.connected) {
            return <div className="d-flex justify-content-center align-items-center h-100">
                <Alert color="warning">
                    <div className="text-center">
                        <Icon path={mdiLockAlertOutline} size={5} />
                    </div>
                    <h1><FormattedMessage id="security.auth.required.title" /></h1>
                    <h2><FormattedMessage id="security.auth.required.sub" /></h2>
                </Alert>
            </div>
        }

        return this.props.children
    }

    componentDidMount(): void {
        this.redirectIfNotConnected()
    }

    componentDidUpdate(): void {
        this.redirectIfNotConnected()
    }

    private redirectIfNotConnected(): void {
        if (!this.security.connected && !context.isNode()) {
            setTimeout(() => {
                if (this.navigator.navigate) {
                    this.navigator.navigate('/login', { state: { from: this.navigator.location }, replace: true })
                }
            }, 2000)
        }
    }
}

export default observer(RequireAuth)
