require('../css/app.scss')

import { setKernel, createEmptyKernel } from '@code-202/kernel'
import { buildDefaultDeserializer } from '@code-202/serializer'
import { loadableReady } from '@loadable/component'
import { decode } from 'js-base64'
import * as React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Bootstrap from './bootstrap'
import { buildContainer } from './container'

declare global {
    interface Window {
        __INITIAL_MANIFEST__: string
        __INITIAL_ENVIRONMENT__: string
        __INITIAL_CONTAINER__: string
    }
}

const bootstrap = (): void => {
    const element: Element = document.getElementById('app') as Element

    if (element) {
        const kernel = createEmptyKernel()
        const deserializer = buildDefaultDeserializer()

        setKernel(kernel)

        deserializer.deserialize(kernel.manifest, decode(window.__INITIAL_MANIFEST__), 'json')
        deserializer.deserialize(kernel.environment, decode(window.__INITIAL_ENVIRONMENT__), 'json')

        buildContainer({})

        deserializer.deserialize(kernel.container, decode(window.__INITIAL_CONTAINER__), 'json')
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
