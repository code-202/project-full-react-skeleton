import webpack from 'webpack'
import path from 'node:path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import overrides from './override.js'
import excludes from './exclude.js'
import nodeExternals from 'webpack-node-externals'

const ssr = true
const target = 'node'

export default (env, argv) => {
    let dist = 'dev'

    if (argv.mode === 'production') {
        dist = 'dist'
    }

    return {
        entry: `./src/js/server${ssr ? '.ssr' : ''}.tsx`,

        target: 'node',
        target,
        output: {
            path: path.resolve('server-build'),
            filename: 'index.js',
            libraryTarget: 'commonjs2',
        },

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js"],
            alias: Object.assign({}, overrides),
            plugins: [new TsconfigPathsPlugin({})]
        },

        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'babel-loader' },
                        {
                            loader: 'ts-loader',
                            options: {
                                silent: true,
                                transpileOnly: true,
                            }

                        }
                    ]
                },
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // Creates `style` nodes from JS strings
                        //'style-loader',
                        // Translates CSS into CommonJS
                        { loader: 'css-loader', options: { url: false, sourceMap: true } },
                        // Compiles Sass to CSS
                        'sass-loader',
                    ],
                }
            ]
        },

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        performance: {
            hints: false
        },

        externals: [nodeExternals({
            allowlist: Object.keys(overrides).concat(excludes),
            whitelist: [
                /^@loadable\/component$/,
                /^react$/,
                /^react-dom$/,
            ]
        })],
        plugins: [
            new webpack.DefinePlugin({
                'process.env.MANIFEST': JSON.stringify('/srv/app/public/' + dist + '/manifest.json'),
                'process.env.LOADABLE_STATS': JSON.stringify('/srv/app/public/' + dist + '/loadable-stats.json'),
            })
        ]
    };
}
