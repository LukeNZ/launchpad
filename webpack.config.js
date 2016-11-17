var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        'vendor': './angular/vendor.ts',
        'tminusten': './angular/main.ts'
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    output: {
        path: path.join(__dirname, 'public/js'),
        publicPath: '/public/js',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['tminusten', 'vendor']
        })
    ],
    node: {
        fs: "empty"
    }
};