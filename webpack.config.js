const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackSkipAssetsPlugin = require('html-webpack-skip-assets-plugin').HtmlWebpackSkipAssetsPlugin;
const overrides = require('./override');

module.exports = (env, argv) => {

    let dist = 'dev'

    if (argv.mode === 'production') {
        dist = 'dist'
    }

    return {
        mode: "development",

        entry: {
            app: './src/js/app.tsx',
            starter: './src/js/starter.ts',
        },

        output: {
            // options related to how webpack emits results
            path: path.resolve(__dirname, "public/"+dist), // string
            filename: "js/[name].[chunkhash].js",
            chunkFilename: 'js/[name].[chunkhash].bundle.js',
            libraryTarget: "umd", // universal module definition
            publicPath: '/'+dist+'/'
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
                        {
                            loader: 'ts-loader',
                            options: { silent: true }
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

        externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/[name].[chunkhash].css",
                chunkFilename: "css/[id].[chunkhash].css"
            }),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['js/**/*', 'css/**/*', '!manifest.json'],
            }),
            new WebpackManifestPlugin({}),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map',
                publicPath: '/'+dist+'/'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {from:'src/translations', to:'translations/[name].[hash][ext]'},
                ]
            }),
            new HtmlWebpackPlugin({
                template: `templates/index.html`,
                filename: '../index.html',
            }),
            new HtmlWebpackSkipAssetsPlugin({
                excludeAssets: [/app.*/],
            }),
            new webpack.DefinePlugin({
                'process.env.ENDPOINT': JSON.stringify(''),
                'process.env.MANIFEST': JSON.stringify(path.resolve(__dirname, 'public/'+dist+'/manifest.json')),
                'process.env.API_ENDPOINT': process.env.API_ENDPOINT,
                'process.env.REACT_URL': JSON.stringify(argv.mode === 'production' ? '/node_modules/react/umd/react.production.min.js' : '/node_modules/react/umd/react.development.js'),
                'process.env.REACTDOM_URL': JSON.stringify(argv.mode === 'production' ? '/node_modules/react-dom/umd/react-dom.production.min.js' : '/node_modules/react-dom/umd/react-dom.development.js'),
            })
        ]
    }
};
