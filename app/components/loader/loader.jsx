/** @jsx React.DOM */

var React = require('react/addons');


// Require Stylesheets
require("!style!css!sass!./loader.scss");

// Component
var Loader = React.createClass({

  getDefaultProps: function () {
    return {
      backgroundColor: '#000'
    };
  },

  render: function () {
    var style = {
      backgroundColor: this.props.backgroundColor
    };

    var showStyle = {
      display: 'block'
    };

    // Dynamic class manipulation
    var cx = React.addons.classSet;
    var classActive = cx({
      'loader': true,
      'active': this.props.show
    });

    return (
      <div className={classActive}>
        <div className="wrapper">
          <div className="d1" style={style}></div>
          <div className="d2" style={style}></div>
          <div className="d3" style={style}></div>
          <div className="d4" style={style}></div>
          <div className="d5" style={style}></div>
        </div>
      </div>
    );
  }
});


module.exports = Loader;