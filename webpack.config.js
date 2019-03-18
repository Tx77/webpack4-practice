const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const lessExtract = new ExtractTextWebpackPlugin('less.css')
const sassExtract = new ExtractTextWebpackPlugin('sass.css')
const chalk = require('chalk')
const AssetsPlugin = require('assets-webpack-plugin')
const NyanProgressPlugin = require('nyan-progress-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {minimize: true}
          }, 'postcss-loader']
        }),
        // include: path.join(__dirname, 'src/style'),
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['env', 'stage-0', 'react']
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            outputPath: 'images/', // 图片输出的路径
            limit: 5 * 1024
          }
        }
      },
      {
        test: /\.(html|html)$/,
        use: 'html-withimg-loader',
        // include: path.join(__dirname, './src'),
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: lessExtract.extract({
          use: ['css-loader', 'less-loader']
        }),
        // include: path.join(__dirname, './src'),
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: sassExtract.extract({
          use: ['css-loader', 'sass-loader']
        }),
        // include: path.join(__dirname, './src'),
        exclude: /node_modules/
      }]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin(),
    new ExtractTextWebpackPlugin({
      filename: 'css/[name].[hash].css'
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          name: 'common'
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin()
    ]
  },
  resolve: {
    extensions: ['.js', 'json', 'css', '.vue', 'jsx']
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9090,
    host: 'localhost',
    overlay: true,
    compress: true
  }
}

const isProd = process.env.NODE_ENV === 'production'
if (!isProd) {
  module.exports.plugins = [
    new AssetsPlugin({
      filename: 'public/webpack.assets.js',
      processOutput: function (assets) {
        return 'window.WEBPACK_ASSETS = ' + JSON.stringify(assets)
      }
    }),
    new NyanProgressPlugin({
      // 获取进度的时间间隔，默认 180 ms
      debounceInterval: 60,
      nyanCatSays(progress, messages) {
        if (progress === 1) {
          return 'lei 了 lei 了'
        }
      }
    }),
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin()
  ]
} else {
  module.exports.plugins = [
    new AssetsPlugin({
      filename: 'public/webpack.assets.js',
      processOutput: function (assets) {
        return 'window.WEBPACK_ASSETS = ' + JSON.stringify(assets)
      }
    }),
    new NyanProgressPlugin({
      // 获取进度的时间间隔，默认 180 ms
      debounceInterval: 60,
      nyanCatSays(progress, messages) {
        if (progress === 1) {
          return 'lei 了 lei 了'
        }
      }
    }),
    new UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin()
  ]
}
