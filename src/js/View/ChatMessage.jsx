/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');

var ChatMessage = React.createClass({
    getDefaultProps: function() {
        return {
            shouldUpdate: true
        };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if (!_.isEqual(this.state, nextState) ||
            this.props.time != nextProps.time ) {
                return true;
        }
        return nextProps.shouldUpdate;
    },
    render: function() {
        var talker = (_.isEmpty(this.props.talker) ? '' :  this.props.talker + ": ");
        var chatType = (_.isEmpty(this.props.chatType) ? '' : "[" + this.props.chatType + "] " );
        return (
            <h4 style={{fontWeight: 'bolder'}}>
                { chatType + talker + this.props.content }
            </h4>
        );
    }
});

module.exports = ChatMessage;
