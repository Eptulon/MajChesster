const path = require('path');

module.exports = {
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/renderer/components'),
      '@/modules': path.resolve(__dirname, 'src/renderer/modules'),
      '@/hooks': path.resolve(__dirname, 'src/renderer/hooks'),
      '@/styles': path.resolve(__dirname, 'src/renderer/styles'),
      '@/utils': path.resolve(__dirname, 'src/renderer/utils'),
    },
  },
};