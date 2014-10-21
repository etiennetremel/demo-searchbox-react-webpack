var config = require('./config')['client'];
var webpack = require("webpack");
var path = require('path');

var exports = {
  entry: [
    './app/app'
  ],
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: 'http://localhost:3002/app/'
  },
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ output: {comments: false} })
  ],
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: "style!css!sass?outputStyle=expanded"
    }, {
      test: /\.jsx$/,
      loaders: ['jsx?insertPragma=React.DOM']
    }]
  },
  devtool: 'source-map'
};

module.exports = exports;