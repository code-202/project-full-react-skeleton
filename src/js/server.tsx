import * as cors from 'cors'
import * as express from 'express'
import * as fs from 'fs'
import { ChunkExtractor } from '@loadable/server'
import * as path from 'path'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import Bootstrap from './bootstrap'
import { Agent } from 'rich-agent'
import { buildContainer } from './store-container'
import { StoreContainer } from 'react-mobx-store-container'
import { Helmet } from 'react-helmet'
import { StaticRouter } from 'react-router-dom/server'
import { Manager } from 'react-mobx-loader'
import { config } from 'dotenv'
import cookiesMiddleware from 'universal-cookie-express'

const statsFile = process.env.LOADABLE_STATS ? process.env.LOADABLE_STATS : ''

const PORT = 3006

Manager.Manager.contentStrategy = 'show'

const renderBootstrap = (req: any, container: StoreContainer, maxRendition: number = 5): Promise<{html: string, extractor: ChunkExtractor}> => {
    return new Promise((resolve, reject) => {
        const extractor = new ChunkExtractor({
            statsFile,
            entrypoints: ['app'],
        });

        const bootstrap =  ReactDOMServer.renderToString(
            extractor.collectChunks(
            <StaticRouter
                location={req.url}
            >
                <Bootstrap container={container}/>
            </StaticRouter>
            )
        )

        Agent.waitForAll().then((nbRequests: number) => {
            if (maxRendition === 0 || nbRequests === 0) {
                resolve({ html: bootstrap, extractor: extractor})
                return
            }

            renderBootstrap(req, container, --maxRendition).then((bootstrap) => {
                resolve(bootstrap)
            })
        })
    })
}

const manifestFile: string = process.env.MANIFEST as string

const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
const stringManifest = JSON.stringify(manifest)

const env = config().parsed
const stringEnv = JSON.stringify(env)

const app = express()

app.use(cookiesMiddleware())

app.use(cors({
    origin: env ? env.API_HOST : ''
}))

const renderIndex = (req: any, res: any) => {

    const e = Object.assign ({/* cookies: req.headers.cookie */}, env)

    const container = buildContainer(manifest, e)
    container.init()

    /*
    if (req.universalCookies.get('api-token')) {
        container.get('endpointStore').loadTokenFromString(req.universalCookies.get('api-token'))
    }
    */

    renderBootstrap(req, container).then((bootstrap) => {
        const helmet = Helmet.renderStatic()
        const dataContainer = JSON.stringify(container.serialize())

        const indexFile = path.resolve('./public/index.html')

        fs.readFile(indexFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Something went wrong:', err)
                return res.status(500).send('Oops, better luck next time!')
            }

            let datas = `<script>window.__INITIAL_STATE__ = { dataContainer: ${dataContainer}, dataManifest: ${stringManifest}}</script>`
            datas += `<script>window.__ENV__ = ${stringEnv}</script>`

            data = data.replace('<div id="app"></div>', `<div id="app">${bootstrap.html}</div>`)
            data = data.replace('<title></title>', helmet.title.toString())
            data = data.replace('<metas/>', helmet.meta.toString())
            data = data.replace('<links/>', helmet.link.toString() + bootstrap.extractor.getStyleTags())
            data = data.replace('<scripts/>', bootstrap.extractor.getScriptTags())
            data = data.replace('<datas/>', datas)

            return res.send(
                data
            )
        })
    })
}

app.get('/', renderIndex);

app.use(express.static('./public'));

app.get('/*', renderIndex);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
