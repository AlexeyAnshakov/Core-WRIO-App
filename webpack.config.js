var path = require('path');
var webpack = require('webpack');
var nconf = require('./src/server/wrio_nconf');

var envs = {};
var minify = false;

if (nconf.get("server:workdomain") == '.wrioos.local')  {
    console.log("Got docker dev mode");
    envs = {
        "process.env": {
            NODE_ENV: JSON.stringify('dockerdev'),
            DOMAIN: JSON.stringify('wrioos.local')
        }
    };
} else {
    minify = true;
    envs = {
        "process.env": {
            NODE_ENV: JSON.stringify('development'),
            DOMAIN: JSON.stringify('wrioos.com')
        }
    }
}

console.log(envs);
var e = {
    entry: './src/client/js/client.js',
    output:
    {
        path: '.',
        filename: './app/client/client.js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: [/node_modules/,/app/],
                query: {
                    presets: ['react', 'es2015','stage-0']
                }
            },
            { test: /\.json$/, loader: "json-loader" }

        ]

    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin(envs)]

};


if (minify) {
    e.plugins.push(new webpack.optimize.UglifyJsPlugin({
        beautify: true,
        mangle: false
    }));
    e.devtool = 'source-map';
}

module.exports = e;