var path = require('path')
var webpack = require('webpack')
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
// var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
var ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
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
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        // other vue-loader options go here
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
  })
])

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new ParallelUglifyPlugin({
      cacheDir: '.tmp',
      uglifyJS: {
        sourceMap: true,
        compress: {
          warnings: false
        }
      }
    }),
    new ServiceWorkerWebpackPlugin({
      entry: './src/service-worker.js'
    }),
    // new SWPrecacheWebpackPlugin(
    //   {
    //     cacheId: 'discogs-scrobbler',
    //     filename: 'service-worker.js',
    //     maximumFileSizeToCacheInBytes: 4194304,
    //     minify: true,
    //     staticFileGlobs: [
    //       'index.html'
    //     ],
    //     runtimeCaching: [{
    //       handler: 'cacheFirst',
    //       urlPattern: /[.]mp3$/
    //     }]
    //   }
    // ),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
