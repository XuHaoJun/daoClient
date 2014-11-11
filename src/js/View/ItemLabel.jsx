/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');

var ItemLabel = module.exports = React.createClass({
  render: function() {
    var style = { position: 'absolute',
                  left: this.props.position.x,
                  top: this.props.position.y};
    return (
      <div style={style}
           zIndex={20}>
        <h3> {this.props.item.name} </h3>
      </div>
    );
  },
});
