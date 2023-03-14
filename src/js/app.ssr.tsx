require('../css/app.scss')

import { setKernel, createEmptyKernel } from '@code-202/kernel'
import { buildDefaultDeserializer } from '@code-202/serializer'
import { loadableReady } from '@loadable/component'
import * as React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Bootstrap from './bootstrap'
import { buildContainer } from './container'

declare global {
    interface Window {
        __INITIAL_STATE__: {
            container: string,
            manifest: string,
            environment: string
        }
    }
}

const bootstrap = (): void => {
    const element: Element = document.getElementById('app') as Element

    if (element) {
        const kernel = createEmptyKernel()
        const deserializer = buildDefaultDeserializer()

        setKernel(kernel)

        deserializer.deserialize(kernel.manifest, window.__INITIAL_STATE__.manifest, 'json')
        deserializer.deserialize(kernel.environment, window.__INITIAL_STATE__.environment, 'json')

        buildContainer()

        deserializer.deserialize(kernel.container, window.__INITIAL_STATE__.container, 'json')
        kernel.container.init()

        hydrateRoot(
            element,
            <BrowserRouter>
                <Bootstrap/>
            </BrowserRouter>
        )
    }
}

loadableReady(() => bootstrap())
