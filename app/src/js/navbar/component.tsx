import * as React from 'react'
import { Link, NavLink } from 'react-router'
import { FormattedMessage } from '@code-202/intl'

import {
    Collapse,
    Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink as BSNavLink
} from 'reactstrap'
import { getKernel } from '@code-202/kernel'
import { Store } from './store'
import * as Security from '../security'
import Icon from '@mdi/react'
import { mdiAccount, mdiDramaMasks, mdiLogin, mdiLogout, mdiStar } from '@mdi/js'
import { observer } from 'mobx-react'
import { Selector } from '../layout'
import { Launcher } from '../cookie-consent'

interface Props { }

interface State { }

class Component extends React.PureComponent<Props, State> {
    protected store: Store
    protected security: Security.Store.Store

    constructor(props: Props) {
        super(props)

        this.store = getKernel().container.get('navbar') as Store
        this.security = getKernel().container.get('security') as Security.Store.Store
    }

    render(): React.ReactNode {
        return (
            <Navbar color="primary" dark expand="md" className="sticky-top" container={false}>
                <NavbarBrand tag="div" className="me-0">
                    <Link to="/" className="text-white text-decoration-none">
                        <Icon path={mdiDramaMasks} className="mx-2" size={1} />
                        <FormattedMessage id="app.title" />
                    </Link>
                </NavbarBrand>
                <NavbarToggler onClick={() => this.store.toggle()} />
                <Collapse isOpen={this.store.isOpen} navbar>
                    <Nav className="d-flex justify-content-center flex-grow-1" navbar>
                        {this.navCenter}
                    </Nav>
                    <Nav className="d-flex justify-content-end pe-2" navbar>
                        {this.navRight}
                    </Nav>
                </Collapse>
            </Navbar>
        )
    }

    protected get navCenter(): React.ReactNode[] {
        return []
    }

    protected get navRight(): React.ReactNode[] {
        const links: React.ReactNode[] = []

        links.push(
            <NavItem key={0}>
                <NavLink to="/demo" className="nav-link">
                    <Icon path={mdiStar} className="me-2" size={1} />
                    Démo
                </NavLink>
            </NavItem>
        )

        links.push(
            <NavItem key={0}>
                <NavLink to="/account" className="nav-link">
                    <Icon path={mdiAccount} className="me-2" size={1} />
                    Mon compte
                </NavLink>
            </NavItem>
        )

        if (this.security.connected) {
            links.push(
                <NavItem key={-1}>
                    <NavLink to="/logout" className="nav-link">
                        <Icon path={mdiLogout} className="me-2" size={1} />
                        <FormattedMessage id="app.logout" />
                    </NavLink>
                </NavItem>
            )
        } else {
            links.push(
                <NavItem key={-1}>
                    <NavLink to="/login" className="nav-link">
                        <Icon path={mdiLogin} className="me-2" size={1} />
                        <FormattedMessage id="app.login" />
                    </NavLink>
                </NavItem>
            )
        }

        links.push(
            <NavItem key={-2}>
                <Launcher className="btn btn-primary" alwaysShown />
            </NavItem>
        )

        links.push(
            <NavItem key={-3}>
                <Selector />
            </NavItem>
        )

        return links
    }
}

export default observer(Component)
