import * as React from 'react'
import { FormattedMessage } from '@code-202/intl'
import Icon from '@mdi/react';
import { mdiExclamationThick } from '@mdi/js';
import { DynamicModule } from '@app/component';

interface Props { }

interface State { }

export default class Home extends React.PureComponent<Props, State> {
    render(): React.ReactNode {
        return (
            <DynamicModule name="account">
                <>
                    <div className="alert alert-success text-center">
                        <h1>
                            <Icon path={mdiExclamationThick} spin={-2} size={1} className="me-2" />

                            <FormattedMessage id="account.welcome" />

                            <Icon path={mdiExclamationThick} spin={2} size={1} className="ms-2" />
                        </h1>
                    </div>
                </>
            </DynamicModule>
        )
    }
}
