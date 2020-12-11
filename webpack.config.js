const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
            new WebpackManifestPlugin({
                map: (file)=> {
                    var match = /^(translations\/.*)\.([^.]+)\.json$/.exec(file.name);
                    if (match) {
                        file.name = match[1] + '.json';
                    }
                    return file;
                }
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map',
                publicPath: '/'+dist+'/'
            }),
            new CopyWebpackPlugin([
                {from:'src/translations', to:'translations/[name].[hash].[ext]'},
            ], { copyUnmodified: true }),
            new HtmlWebpackPlugin({
                template: `templates/index.${argv.mode ? 'production' : 'development'}.html`,
                filename: '../index.html',
            }),
            new webpack.DefinePlugin({
                'process.env.ENDPOINT': JSON.stringify(''),
                'process.env.MANIFEST': JSON.stringify(path.resolve(__dirname, 'public/'+dist+'/manifest.json')),
                'process.env.API_ENDPOINT': process.env.API_ENDPOINT
            })
        ]
    }
};
