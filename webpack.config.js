var isDevBuild = process.argv.indexOf('--env.prod') < 0;
var path = require('path');
const webpack = require('webpack');
const { AureliaPlugin } = require("aurelia-webpack-plugin");

var bundleOutputDir = './wwwroot/dist';
module.exports = {
    entry: { 'app': "aurelia-bootstrapper" },

    output: {
        path: path.resolve(bundleOutputDir),
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        extensions: [".ts", ".js"],
        modules: ["ClientApp", "node_modules"],
    },

    module: {
        rules: [           
            { test: /\.css$/i, use: ["css-loader"] },
            { test: /\.html$/i, use: ["html-loader"] },
            { test: /\.ts$/i, loaders: ['ts-loader'], exclude: path.resolve(__dirname, 'node_modules') },
            { test: /\.json$/i, loader: 'json-loader', exclude: path.resolve(__dirname, 'node_modules') },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader', query: { limit: 8192 } } 
        ]

    },

    plugins: [
        new webpack.DefinePlugin({ IS_DEV_BUILD: JSON.stringify(isDevBuild) }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./wwwroot/dist/vendor-manifest.json')
        }),
        new AureliaPlugin({ includeAll: "ClientApp" })
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
