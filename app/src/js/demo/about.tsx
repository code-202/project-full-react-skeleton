import * as React from 'react'
import { FormattedMessage } from '@code-202/intl'
import Icon from '@mdi/react';
import { mdiArrowLeftBoldCircle, mdiExclamationThick } from '@mdi/js';
import { DynamicModule } from '@app/component';
import { Link } from 'react-router';

interface Props { }

interface State { }

export default class About extends React.PureComponent<Props, State> {
    render(): React.ReactNode {
        return (
            <DynamicModule name="demo">
                <>
                    <div className="alert alert-success text-center">
                        <h1>
                            <Icon path={mdiExclamationThick} spin={-2} size={1} className="me-2" />

                            <FormattedMessage id="app.about" />

                            <Icon path={mdiExclamationThick} spin={2} size={1} className="ms-2" />
                        </h1>
                    </div>
                    <Link to="/demo">
                        <Icon path={mdiArrowLeftBoldCircle} size={1} />
                    </Link>
                </>
            </DynamicModule>
        )
    }
}
