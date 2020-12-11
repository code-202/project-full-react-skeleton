require('../css/app.scss')

import * as React from 'react'
import { hydrate } from 'react-dom'
import Bootstrap from './bootstrap'
import { BrowserRouter } from 'react-router-dom'
import { Container } from './store-container'

const element: Element = document.getElementById('app') as Element

if (element) {
    const dataManifest = unescape(element.getAttribute('data-manifest') || '')
    const dataContainer = unescape(element.getAttribute('data-container') || '')
    const container = Container(JSON.parse(dataManifest))
    container.deserialize(JSON.parse(dataContainer))

    hydrate(
        <BrowserRouter>
            <Bootstrap container={container} />
        </BrowserRouter>,
        element
    )
}
