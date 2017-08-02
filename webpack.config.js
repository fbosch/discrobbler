var path = require('path')
var webpack = require('webpack')
var BabiliPlugin = require('babili-webpack-plugin')
var OptimizeJsPlugin = require('optimize-js-plugin')
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
var ManifestPlugin = require('webpack-manifest-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

module.exports.plugins = (module.exports.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"' + process.env.NODE_ENV + '"',
      DISCOGS_KEY: JSON.stringify(process.env.DISCOGS_KEY),
      DISCOGS_SECRET: JSON.stringify(process.env.DISCOGS_SECRET),
      LASTFM_KEY: JSON.stringify(process.env.LASTFM_KEY),
      LASTFM_SECRET: JSON.stringify(process.env.LASTFM_SECRET),
      FIREBASE_WEB_API_KEY: JSON.stringify(process.env.FIREBASE_WEB_API_KEY)
    }
  }),
  new CopyWebpackPlugin([
    { from: 'src/static' }
  ])
])

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new BabiliPlugin(),
    new OptimizeJsPlugin({
      sourceMap: false
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'discogs-scrobbler-v0.0.3',
        filename: 'service-worker.js',
        maximumFileSizeToCacheInBytes: 4194304,
        minify: true,
        staticFileGlobs: [
          '/',
          'index.html',
          './dist/build.js',
          './dist/record.svg',
          './dist/vinyls.svg'
        ]
      }
    ),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
