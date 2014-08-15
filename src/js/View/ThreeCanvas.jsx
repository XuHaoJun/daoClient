/** @jsx React.DOM */

var React = require('react');

var ThreeCanvas = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    return <canvas id='threeCanvas' />;
  }
});

module.exports = ThreeCanvas;
