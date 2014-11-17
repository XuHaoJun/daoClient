/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');

var EmptyItem = React.createClass({
    shouldComponentUpdate: function() {
        return false;
    },
    render: function() {
        return (
            <div className="dao-emptyItem">
            </div>
        );
    }
});

module.exports = EmptyItem;
