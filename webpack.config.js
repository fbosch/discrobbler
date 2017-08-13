var path = require('path')
var webpack = require('webpack')
var BabiliPlugin = require('babili-webpack-plugin')
var OptimizeJsPlugin = require('optimize-js-plugin')
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
var ManifestPlugin = require('webpack-manifest-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

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
            scss: ExtractTextPlugin.extract({
              use: 'css-loader!sass-loader',
              fallback: 'vue-style-loader'
            }),
            sass: ExtractTextPlugin.extract({
              use: 'css-loader!sass-loader?indentedSyntax',
              fallback: 'vue-style-loader'
            })
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|webp)$/,
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
  new ExtractTextPlugin({filename: '[name].css', allChunks: true}),  
  new webpack.DefinePlugin({
    'process.env': {
      VERSION: JSON.stringify(process.env.npm_package_version),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      DISCOGS_KEY: JSON.stringify(process.env.DISCOGS_KEY),
      DISCOGS_SECRET: JSON.stringify(process.env.DISCOGS_SECRET),
      LASTFM_KEY: JSON.stringify(process.env.LASTFM_KEY),
      LASTFM_SECRET: JSON.stringify(process.env.LASTFM_SECRET),
      CLOUDINARY_KEY: JSON.stringify(process.env.CLOUDINARY_KEY),      
      CLOUDINARY_SECRET: JSON.stringify(process.env.CLOUDINARY_SECRET),
      FIREBASE_WEB_API_KEY: JSON.stringify(process.env.FIREBASE_WEB_API_KEY)
    }
  })
])

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new BundleAnalyzerPlugin(),
    new LodashModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BabiliPlugin(),
    new OptimizeJsPlugin({ sourceMap: false }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: `discogs-scrobbler-v${process.env.npm_package_version}` ,
        filename: 'service-worker.js',
        maximumFileSizeToCacheInBytes: 4194304,
        minify: true,
        staticFileGlobs: [
          '/',
          'index.html',
          './dist/build.js',
          './dist/main.css'
        ]
      }
    ),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
