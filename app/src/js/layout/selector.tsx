import { FormattedMessage } from '@code-202/intl'
import { getKernel } from '@code-202/kernel'
import { mdiWeatherNight, mdiWeatherSunny } from '@mdi/js'
import Icon from '@mdi/react'
import { observer } from 'mobx-react'
import * as React from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { Store } from '.'

interface Props { }

interface State { }

class Selector extends React.PureComponent<Props, State> {
    protected store: Store.Store

    constructor(props: Props) {
        super(props)

        this.store = getKernel().container.get('layout') as Store.Store
    }

    render() {
        return (
            <UncontrolledDropdown>
                <DropdownToggle caret color="primary">
                    <Icon path={this.store.mode == 'dark' ? mdiWeatherNight : mdiWeatherSunny} size={1} />
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem active={this.store.mode == 'light'} onClick={() => this.store.mode = 'light'}>
                        <Icon path={mdiWeatherSunny} size={1} className="me-2" />
                        <FormattedMessage id="app.theme.light" />
                    </DropdownItem>
                    <DropdownItem active={this.store.mode == 'dark'} onClick={() => this.store.mode = 'dark'}>
                        <Icon path={mdiWeatherNight} size={1} className="me-2" />
                        <FormattedMessage id="app.theme.dark" />
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        )
    }
}

export default observer(Selector)
