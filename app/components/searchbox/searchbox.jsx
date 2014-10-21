/** @jsx React.DOM */

var React = require('react/addons');

// Require dependencies
var $ = require('jquery');
var Loader = require('../loader/loader');

// Require Stylesheets
require("!style!css!sass!./searchbox.scss");


// Component
var SearchBox = React.createClass({
  getInitialState: function () {
    return {
      fetching: false,
      query: '',
      searchResult: [],
      keyUpTimeout: null,
      request: null
    };
  },

  componentWillUnmount: function () {
    if (this.state.request) {
      request.abort();
    }
  },

  // Request API
  doRequest: function () {
    var self = this;
    var query = this.state.query;
    var request = this.state.request;

    // Abort request if already one in progress
    if (request && request.readyState !== 4) {
      request.abort();
    }

    // If only 1 character do not process the request
    if (query.length <= 1) {
      self.setState({
        fetching: false,
        searchResult: []
      });
      return;
    }

    self.setState({
      fetching: true
    });

    self.state.request = $.getJSON(self.props.url + '?query=' + query, function (result) {
      self.setState({
        fetching: false,
        searchResult: result
      });
    });
  },

  // Set changes in state
  onChangeHandler: function (e) {
    this.setState({query: e.target.value});
  },

  // Set timeout to prevent too many server request while the user is typing
  onKeyUpHandler: function () {
    this.state.keyUpTimeout = setTimeout(this.doRequest, 500);
  },

  // Clear timeout if the user is typing
  onKeyDownHandler: function () {
    clearTimeout(this.state.keyUpTimeout);
  },

  // Clear field
  clearField: function () {
    this.setState({
      query: '',
      searchResult: []
    }, function() {
      this.refs.queryField.getDOMNode().focus();
    });
  },

  render: function () {

    // Results
    var searchResult = this.state.searchResult.map(function (item, index) {
      var imageUrl = 'https://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';

      return (
        <li className="col-xs-3 center-xs middle-xs">
          <div className="box">
            <a href={imageUrl} target="_blank">
              <img src={imageUrl} alt={item.title} />
              <div className="caption">{item.title}</div>
            </a>
          </div>
        </li>
      )
    });

    // Dynamic class manipulation
    var cx = React.addons.classSet;

    var classHeader = cx({
      'row': true,
      'header': true,
      'center-xs': true,
      'active': this.state.query.length > 0,
      'has-result': this.state.searchResult.length > 0,
      'middle-xs': !this.state.searchResult.length
    });

    var classClearField = cx({
      'clear': true,
      'active': this.state.query.length
    });

    return (
      <div className="searchbox">
        <div className={classHeader}>
          <div className="box col-xs-12 center-xs">
            <input
              type="text"
              placeholder="Search for..."
              ref="queryField"
              onKeyDown={this.onKeyDownHandler}
              onKeyUp={this.onKeyUpHandler}
              value={this.state.query}
              onChange={this.onChangeHandler}
            />
            <div className={classClearField} onClick={this.clearField}>&times;</div>
          </div>
        </div>
        <div className="results">
          <Loader show={this.state.fetching} backgroundColor="#ddd" />
          <ul className="row around-xs">
            {searchResult}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = SearchBox;