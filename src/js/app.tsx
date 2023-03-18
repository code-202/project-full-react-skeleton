require('../css/app.scss')

import { setKernel, createEmptyKernel } from '@code-202/kernel'
import { buildDefaultDeserializer, Decoder } from '@code-202/serializer'
import { decode } from 'js-base64'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Bootstrap from './bootstrap'
import { buildContainer } from './container'

declare global {
    interface Window {
        __INITIAL_MANIFEST__: string
        __INITIAL_ENVIRONMENT__: string
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
        kernel.container.init()

        const root = createRoot(element)
        root.render(<BrowserRouter>
                <Bootstrap/>
            </BrowserRouter>
        )
    }
}

bootstrap()
