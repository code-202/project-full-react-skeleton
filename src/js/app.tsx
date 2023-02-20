require('../css/app.scss')

import * as React from 'react'
import { hydrateRoot } from 'react-dom/client'
import Bootstrap from './bootstrap'
import { BrowserRouter } from 'react-router-dom'
import { buildContainer } from './store-container'
import { loadableReady } from '@loadable/component'

declare global {
    interface Window {
        __INITIAL_STATE__: {
            dataContainer: any
            dataManifest: Record<string, string>
        },
        __ENV__: {
            'ENDPOINT': string
        }
    }
}

const bootstrap = (): void => {
    const element: Element = document.getElementById('app') as Element

    if (element) {
        const container = buildContainer(window.__INITIAL_STATE__.dataManifest, window.__ENV__)
        container.deserialize(window.__INITIAL_STATE__.dataContainer)
        container.init()

        hydrateRoot(
            element,
            <BrowserRouter>
                <Bootstrap container={container} />
            </BrowserRouter>
        )
    }
}

loadableReady(() => bootstrap())
