require('../css/starter.scss')

import { ResourcesLoader } from '@code-202/starter'
import { Manifest } from '@code-202/kernel'
import { buildDefaultDeserializer } from '@code-202/serializer'
import { decode } from 'js-base64'

declare global {
    interface Window {
        __INITIAL_MANIFEST__: string
    }
}

const deserializer = buildDefaultDeserializer()

const manifest = new Manifest({}, '')
deserializer.deserialize(manifest, decode(window.__INITIAL_MANIFEST__), 'json')

const ressources = {
    'css': manifest.get('app.css'),
    'react': '/static' + process.env.REACT_URL as string,
    'react-dom': '/static' + process.env.REACTDOM_URL as string,
    'js': manifest.get('app.js'),
}

const resourcesLoader = new ResourcesLoader('app')
resourcesLoader.errorMessage = 'Oups...'
resourcesLoader.addResources(ressources)
