var config = require('./config');
var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var morgan = require('morgan');
var compress = require('compression');

// Init Express app
var app = express();
app.use(morgan('combined'));
app.use(compress());

// Connect to Mongoose:
mongoose.connect(config['api'].mongo.uri);

// Model, keep data in cache for 15 days
var CachedQuery = mongoose.model('Cache', {
  query: String,
  photos: Array,
  time: {
    type: Date,
    expires: 60*15 // Item expire in 15 minutes
  }
});


app.get('/search', function (req, res) {

  // Cross origin
  res.header('Access-Control-Allow-Origin', 'http://' + config['client'].domain + ':' + config['client'].port);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  var query = req.query.query || '';

  // If query not defined return 400
  if (!query) {
    return res.status(400).send('Bad Request');
  }

  console.log('Looking if query is cached for keyword: ', query);

  CachedQuery.findOne({query: query}, function (err, cache) {

    console.log('Query not cached.');

    if (err || !cache) {

      // Process Yahoo query
      request({
        url: 'https://query.yahooapis.com/v1/public/yql',
        qs: {
          q: 'select * from flickr.photos.interestingness(10) where api_key="' + config['api'].flickrAPIKey + '" and title like "%' + query + '%" and ispublic=1',
          format: 'json'
        },
        json: true
      }, function (error, response, body) {

        console.log('done.');

        if (!error && response.statusCode === 200) {

          var photos = body.query.count > 1
            ? body.query.results.photo
            : body.query.count
              ? [body.query.results.photo]
              : [];

          new CachedQuery({
            query: query,
            photos: photos
          }).save();

          return res.send(photos);
        } else {
          return res.send(response);
        }

      });
    } else {
      setTimeout(function () {
        res.send(cache.photos);
      }, 2000);
    }
  });
});

app.listen(config['api'].port, function () {
  console.log('Express server started on port http://%s:%s', config['api'].domain, config['api'].port);
});