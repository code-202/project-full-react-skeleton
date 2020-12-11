require('../css/starter.scss')

import { ResourcesLoader } from 'js-starter'
import Manifest from './manifest'

const element: Element = document.getElementById('app') as Element

let dataManifest = {}

if (element) {
    dataManifest = JSON.parse(unescape(element.getAttribute('data-manifest') || ''))
}

const manifest = new Manifest(dataManifest)

const ressources = {
    'css': manifest.get('app.css'),
    'js': manifest.get('app.js'),
    'react': process.env.REACT_URL,
    'react-dom': process.env.REACTDOM_URL,
}

const resourcesLoader = new ResourcesLoader('app')
resourcesLoader.errorMessage = 'Oups...'
resourcesLoader.addResources(ressources)
