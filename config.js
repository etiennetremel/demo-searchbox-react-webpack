/**
 * Config
 */

module.exports = {
  api: {
    domain:       'localhost',
    port:         3000,
    mongo: {
      uri:        'mongodb://localhost/flickrapi'
    },
    flickrAPIKey: ''
  },
  client: {
    domain:       'localhost',
    port:         3001
  }
};