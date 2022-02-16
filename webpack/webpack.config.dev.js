const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    port: 3000,
  },
  optimization: {
    runtimeChunk: true
  },
});
