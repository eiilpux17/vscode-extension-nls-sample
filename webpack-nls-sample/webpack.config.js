const path = require("path");
module.exports = {
    target: 'node',
    entry: __dirname + "/src/extension.js",
    output: {
        path: __dirname + "/out",
        filename: "bundle.js",
        libraryTarget: "commonjs2"
    },
    devtool: 'source-map',
    externals: {
        vscode: "commonjs vscode"
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [{
            loader: 'vscode-nls-dev/lib/webpack-loader',
            options: {
                base: path.join(__dirname, 'src')
            } 
        }]
    }
}