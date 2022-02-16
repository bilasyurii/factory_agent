const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'textures',
          to: 'textures',
          noErrorOnMissing: true,
        },
        {
          from: 'fonts',
          to: 'fonts',
          noErrorOnMissing: true,
        },
      ],
    }),
  ]
});
