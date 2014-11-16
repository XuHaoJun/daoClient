/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var ProgressBar = BS.ProgressBar;

var CharHpMpBar = React.createClass({
    getDefaultProps: function() {
        return {
            shouldUpdate: true
        };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return (nextProps.shouldUpdate ? true : false);
    },
    render: function() {
        var char = this.props.char;
        var hpNow = (char.hp / char.maxHp) * 100;
        var mpNow = (char.mp / char.maxMp) * 100;
        return (
            <div>
                <ProgressBar bsStyle='danger' now={hpNow}
                             label="%(percent)s%" style={{'margin-bottom': '2px'}}/>
                <ProgressBar bsStyle='info' now={mpNow}
                             label="%(percent)s%"  style={{'margin-bottom': '4px'}}/>
            </div>
        );
    }
});

module.exports = CharHpMpBar;
