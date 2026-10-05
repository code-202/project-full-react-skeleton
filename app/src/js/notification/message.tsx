import { FormattedMessage } from '@code-202/intl'
import * as React from 'react'
import { Text } from './definition'

export type Error = string | { id: string, values?: any }

interface Props {
    text: Text
    enableHtml?: boolean
}

interface State {
}

export default class Message extends React.Component<Props, State> {
    render() {
        const { text, enableHtml } = this.props

        if (typeof text == 'string') {
            if (enableHtml) {
                return <span
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            }
            return text
        }

        return (
            <FormattedMessage id={text.id} values={text.values} html={text.html && enableHtml} />
        )
    }
}
