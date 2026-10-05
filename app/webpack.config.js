import webpack from 'webpack'
import path from 'node:path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { HtmlWebpackSkipAssetsPlugin } from 'html-webpack-skip-assets-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import overrides from './override.js'
import LoadablePlugin from '@loadable/webpack-plugin'

const __dirname = import.meta.dirname
const ssr = true

export default (env, argv) => {

    let dist = 'dev'

    if (argv.mode === 'production') {
        dist = 'dist'
    }

    return {
        mode: argv.mode,

        entry: ssr ? {
            app: './src/js/app.ssr.tsx',
        } : {
            app: './src/js/app.tsx',
            starter: './src/js/starter.ts',
        },

        output: {
            // options related to how webpack emits results
            path: path.resolve(__dirname, "public/" + dist), // string
            filename: "js/[name].[chunkhash].js",
            chunkFilename: 'js/[name].[chunkhash].bundle.js',
            libraryTarget: "umd", // universal module definition
            publicPath: '/static/' + dist + '/'
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
                            },
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
                        { loader: 'css-loader', options: { url: false, sourceMap: false } },
                        // Compiles Sass to CSS
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    quietDeps: true,
                                    silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import', 'if-function', 'legacy-js-api'],
                                },
                            },
                        },
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

        plugins: [
            new LoadablePlugin(),
            new MiniCssExtractPlugin({
                filename: "css/[name].[chunkhash].css",
                chunkFilename: "css/[id].[chunkhash].css"
            }),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['js/**/*', 'css/**/*', 'translations/**', '!manifest.json'],
            }),
            new WebpackManifestPlugin(),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map',
                publicPath: '/static/' + dist + '/'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'src/translations', to: 'translations/[name].[chunkhash][ext]', force: true },
                ]
            }),
            new HtmlWebpackPlugin({
                template: `templates/index${ssr ? '.ssr' : ''}.html`,
                filename: '../index.html',
            }),
            new HtmlWebpackSkipAssetsPlugin({
                excludeAssets: [/app.*/],
            }),
            new webpack.DefinePlugin({
                'process.env.ENDPOINT': JSON.stringify(''),
                'process.env.MANIFEST': JSON.stringify(path.resolve(__dirname, 'public/' + dist + '/manifest.json')),
                'process.env.API_ENDPOINT': process.env.API_ENDPOINT,
            })
        ]
    }
};
