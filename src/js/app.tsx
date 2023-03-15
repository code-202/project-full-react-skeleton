require('../css/app.scss')

import { setKernel, createEmptyKernel } from '@code-202/kernel'
import { buildDefaultDeserializer, Decoder } from '@code-202/serializer'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Bootstrap from './bootstrap'
import { buildContainer } from './container'

declare global {
    interface Window {
        __INITIAL_STATE__: {
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
