const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, './src/index.ts'),
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CopyPlugin({
            patterns: [{from: './src/assets', to: 'assets'}],
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {test: /\.ts$/i, use: 'ts-loader'},
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    mode: 'development',
};
