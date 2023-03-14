const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const overrides = require('./override');
const excludes = require('./exclude');
const target = 'node'

const ssr = false

module.exports = (env, argv) => {

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
            alias: Object.assign({}, overrides)
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
                'process.env.MANIFEST': JSON.stringify(path.resolve(__dirname, 'public/'+dist+'/manifest.json')),
                'process.env.LOADABLE_STATS': JSON.stringify(path.resolve(__dirname, 'public/'+dist+'/loadable-stats.json')),
            })
        ]
    };
}
