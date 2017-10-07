var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  rules: [
    {
      test: /\.js?$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      options: {
        fix: true,
      },
    },
  ],
})
