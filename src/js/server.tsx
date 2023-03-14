import { Environment, Manifest } from '@code-202/kernel'
import { buildDefaultSerializer } from '@code-202/serializer'
import * as cors from 'cors'
import { config } from 'dotenv'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'
const PORT = 3006

const environment = new Environment<'ENDPOINT' | 'CORS'>({}, config().parsed as Record<string, string>)

const manifestFile = process.env.MANIFEST as string
const manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
const manifest = new Manifest(manifestData, environment.get('ENDPOINT')+'')

const app = express()

const envCors = environment.get('CORS')
app.use(cors({
    origin: envCors ? envCors.split(',') : ''
}))

const serializer = buildDefaultSerializer()
const serializedManifest = serializer.serialize(manifest, 'json')
const serializedEnvironment = serializer.serialize(environment, 'json')

const renderIndex = (req: any, res: any) => {

    const indexFile = path.resolve('./public/index.html')

    fs.readFile(indexFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Something went wrong:', err)
            return res.status(500).send('Oops, better luck next time!')
        }

        const datas = `<script>window.__INITIAL_STATE__ = { manifest: '${serializedManifest}', environment: '${serializedEnvironment}' }</script>`

        data = data.replace('<datas/>', datas)

        return res.send(
            data
        )
    })
}

app.get('/', renderIndex);

app.use('/static', express.static('./public', {fallthrough: false}))

app.get('/*', renderIndex);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
