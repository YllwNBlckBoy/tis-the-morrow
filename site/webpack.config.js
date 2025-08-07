module.exports = {
    module: {
    rules: [
        {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Or MiniCssExtractPlugin.loader for production
        },
    ],
    },
};