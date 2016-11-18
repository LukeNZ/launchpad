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
        }),
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            root('./src') // location of your src
        )
    ],
    node: {
        fs: "empty"
    }
};

// ContextReplacementPlugin and the below root function is a temporary fix until
// https://github.com/angular/angular/issues/11580 is closed.
function root(__path) {
    return path.join(__dirname, __path);
}