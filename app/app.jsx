/** @jsx React.DOM */

var React = require('react');

// Require components
var SearchBox = require('./components/searchbox/searchbox');

// Require Stylesheets
require('!style!css!normalize-css/normalize.css');
require('!style!css!flexboxgrid/css/flexboxgrid.css');
require('!style!css!sass!./app.scss');


// App init
var App = React.createClass({
  render: function () {
    return <SearchBox url="http://localhost:3000/search" />
  }
});

React.renderComponent(
  <App />,
  document.getElementById('app')
);

module.exports = App;