import * as React from 'react'
import { LoadingScreen } from '@code-202/loader'

export default class Loader extends React.Component {
    render (): React.ReactNode {
        return (
            <div className="h-100 w-100 d-flex justify-content-center align-items-center flex-column text-primary">
                <LoadingScreen size='xl' />
            </div>
        )
    }
}
