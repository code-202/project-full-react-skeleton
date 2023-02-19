import * as cors from 'cors'
import * as express from 'express'
import * as fs from 'fs'
import * as Loadable from 'react-loadable'
import * as path from 'path'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import Bootstrap from './bootstrap'
import { Agent } from 'rich-agent'
import { Container } from './store-container'
import { StoreContainer } from 'react-mobx-store-container'
import { Helmet } from 'react-helmet'
import { StaticRouter } from 'react-router-dom/server'
import { Manager } from 'react-mobx-loader'

const PORT = 3006

Manager.Manager.contentStrategy = 'show'

const renderBootstrap = (req: any, container: StoreContainer) => {
    return ReactDOMServer.renderToString(
        <StaticRouter
            location={req.url}
        >
            <Bootstrap container={container}/>
        </StaticRouter>
    )
}

const manifestFile: string = process.env.MANIFEST as string

const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
const escapeManifest = escape(JSON.stringify(manifest))

const app = express()

app.use(cors({
    origin: '*'
}))

const renderIndex = (req: any, res: any) => {
    const container = Container(manifest)

    renderBootstrap(req, container)

    Agent.waitForAll().then((nbRequests: number) => {
        const bootstrap = renderBootstrap(req, container)
        const helmet = Helmet.renderStatic()
        const dataContainer = JSON.stringify(container.serialize())

        const indexFile = path.resolve('./public/index.html')

        fs.readFile(indexFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Something went wrong:', err)
                return res.status(500).send('Oops, better luck next time!')
            }

            data = data.replace('<div id="app"></div>', `<div id="app" data-container="${escape(dataContainer)}" data-manifest="${escapeManifest}">${bootstrap}</div>`)
            data = data.replace('<title></title>', helmet.title.toString())

            return res.send(
                data
            );
        });
    })
}

app.get('/', renderIndex);

app.use(express.static('./public'));

app.get('/*', renderIndex);

Loadable.preloadAll().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    })
})
