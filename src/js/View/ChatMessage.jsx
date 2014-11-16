/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');

var ChatMessage = React.createClass({
    render: function() {
        var talker = (_.isEmpty(this.props.talker) ? '' :  this.props.talker + ": ");
        return (
            <h4 style={{'font-weight': 'bolder'}}>
                { "[" + this.props.chatType + "] " + talker + this.props.content }
            </h4>
        );
    }
});

module.exports = ChatMessage;
