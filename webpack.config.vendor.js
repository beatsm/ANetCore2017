var isDevBuild = process.argv.indexOf('--env.prod') < 0;
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('vendor.css');
const { AureliaPlugin } = require("aurelia-webpack-plugin");

module.exports = {
    resolve: {
        extensions: [ '.js' ]
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                loader: 'css-loader',
                issuer: /\.html?$/i
            },
            {
                test: /\.css$/i,
                loader: ['style-loader', 'css-loader'],
                issuer: /\.[tj]s$/i
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, loader: 'url-loader?limit=100000' },
            { test: /\.css(\?|$)/, loader: extractCSS.extract(['css-loader']) }
        ]
    },
    entry: {
        vendor: [
            'aurelia-event-aggregator',
            'aurelia-fetch-client',
            'aurelia-framework',
            'aurelia-history-browser',
            'aurelia-logging-console',
            'aurelia-pal-browser',
            'aurelia-polyfills',
            'aurelia-route-recognizer',
            'aurelia-router',
            'aurelia-templating-binding',
            'aurelia-templating-resources',
            'aurelia-templating-router',
            'bootstrap',
            'bootstrap/dist/css/bootstrap.css',
            'jquery'
        ],
    },
    output: {
        path: path.join(__dirname, 'wwwroot', 'dist'),
        publicPath: '/dist/',
        filename: '[name].js',
        library: '[name]_[hash]',
    },
    plugins: [
        extractCSS,
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
        new webpack.DllPlugin({
            path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
            name: '[name]_[hash]'
        }),
        new AureliaPlugin({
            aureliaApp: undefined
        }),
    ].concat(isDevBuild ? [] : [
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ])
};