import { Agent } from '@code-202/agent'
import { Container, Environment, Kernel, Manifest, setKernel } from '@code-202/kernel'
import { Manager } from '@code-202/loader'
import { buildDefaultSerializer } from '@code-202/serializer'
import { ChunkExtractor } from '@loadable/server'
import * as cors from 'cors'
import { config } from 'dotenv'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { Helmet } from 'react-helmet'
import { StaticRouter } from 'react-router-dom/server'
//import cookiesMiddleware from 'universal-cookie-express'
import Bootstrap from './bootstrap'
import { buildContainer } from './container'

const statsFile = process.env.LOADABLE_STATS ? process.env.LOADABLE_STATS : ''

const PORT = 3006

Manager.Manager.contentStrategy = 'wait'

const renderBootstrap = (req: any, maxRendition: number = 5): Promise<{html: string, extractor: ChunkExtractor}> => {
    return new Promise((resolve, reject) => {
        const extractor = new ChunkExtractor({
            statsFile,
            entrypoints: ['app'],
        })

        const bootstrap =  ReactDOMServer.renderToString(
            extractor.collectChunks(
            <StaticRouter
                location={req.url}
            >
                <Bootstrap/>
            </StaticRouter>
            )
        )

        Agent.waitForAll().then((nbRequests: number) => {
            if (maxRendition === 0 || nbRequests === 0) {
                resolve({ html: bootstrap, extractor: extractor})
                return
            }

            renderBootstrap(req, --maxRendition).then((bootstrap) => {
                resolve(bootstrap)
            })
        })
    })
}

const environment = new Environment<'ENDPOINT' | 'CORS'>({}, config().parsed as Record<string, string>)

const manifestFile = process.env.MANIFEST as string
const manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
const manifest = new Manifest(manifestData, environment.get('ENDPOINT')+'')

const app = express()

//app.use(cookiesMiddleware())

const envCors = environment.get('CORS')
app.use(cors({
    origin: envCors ? envCors.split(',') : ''
}))

const serializer = buildDefaultSerializer()

const renderIndex = (req: any, res: any) => {

    const container = new Container()
    const kernel = new Kernel(container, environment, manifest)

    setKernel(kernel, true)

    buildContainer({/*cookies: req.headers.cookie*/})
    container.init()

    /*
    if (req.universalCookies.get('api-token')) {
        container.get('security').loadTokenFromString(req.universalCookies.get('api-token'))
    }
    */

    renderBootstrap(req).then((bootstrap) => {

        const helmet = Helmet.renderStatic()

        const serializedContainer = serializer.serialize(kernel.container, 'json')
        const serializedManifest = serializer.serialize(kernel.manifest, 'json')
        const serializedEnvironment = serializer.serialize(kernel.environment, 'json')

        const indexFile = path.resolve('./public/index.html')

        fs.readFile(indexFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Something went wrong:', err)
                return res.status(500).send('Oops, better luck next time!')
            }

            const datas = `<script>window.__INITIAL_STATE__ = { container: '${serializedContainer}', manifest: '${serializedManifest}', environment: '${serializedEnvironment}' }</script>`

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

app.use('/static', express.static('./public', {fallthrough: false}))

app.get('/*', renderIndex);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
