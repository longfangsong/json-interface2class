const path = require('path');

module.exports = {
    mode: 'production',
    entry: './index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [/node_modules/, /test\.ts/]
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'json-string',
        libraryTarget: "umd"
    }
};
