var isDevBuild = process.argv.indexOf('--env.prod') < 0;
var path = require('path');
const webpack = require('webpack');
const { AureliaPlugin } = require("aurelia-webpack-plugin");

var bundleOutputDir = './wwwroot/dist';
module.exports = {
    entry: { main: "aurelia-bootstrapper" },

    output: {
        path: path.resolve(bundleOutputDir),
        publicPath: '/dist/',
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.js', '.ts'],
        modules: ["ClientApp", "node_modules"].map(x => path.resolve(x))
    },

    module: {
        rules: [
            { test: /\.css$/i, loader: 'css-loader', issuer: /\.html?$/i },
            { test: /\.css$/i, loader: ['style-loader', 'css-loader'], issuer: /\.[tj]s$/i },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
            { test: /\.less$/i, use: ["style-loader", "css-loader", "less-loader"] },
            { test: /\.ts$/, include: /ClientApp/, use: ['awesome-typescript-loader?silent=true'] },
            { test: /\.html$/i, use: "html-loader" }
        ]

    },

    plugins: [
        new webpack.DefinePlugin({ IS_DEV_BUILD: JSON.stringify(isDevBuild) }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./wwwroot/dist/vendor-manifest.json')
        }),
        new AureliaPlugin({
            aureliaApp: undefined
        })
    ].concat(isDevBuild ? [
        // Plugins that apply in development builds only
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map', // Remove this line if you prefer inline source maps
            moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
        })
    ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin()
        ])
};
