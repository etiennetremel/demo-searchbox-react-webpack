var config = require('./config')['client'];
var path = require('path');
var express = require('express');
var compress = require('compression');

// Express setup
var app = express();
app.use(compress());
app.use('/app', express.static(path.join(__dirname, 'app')));
app.set('view engine', 'ejs');

// Routes
app.get('/*', function (req, res) {
  res.render('index');
});

// Start server
app.listen(config.port, function () {
  console.log('Express server started on port http://%s:%s', config.domain, config.port);
});

// Start Webpack server
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');

new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  stats: {
    colors: true
  },
  headers: {
    'Access-Control-Allow-Origin': 'http://' + config.domain + ':' + config.port,
    'Access-Control-Allow-Headers': 'X-Requested-With'
  }
}).listen(3002, 'localhost', function (err, result) {
  if (err) { console.log(err); }
  console.log('Webpack dev server listening on http://localhost:3002');
});