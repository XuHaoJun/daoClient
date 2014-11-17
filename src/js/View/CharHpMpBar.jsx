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
        if (_.isEqual(this.props, nextProps)) {
            return false;
        }
        return (nextProps.shouldUpdate ? true : false);
    },
    render: function() {
        var hpNow = (this.props.hp / this.props.maxHp) * 100;
        var mpNow = (this.props.mp / this.props.maxMp) * 100;
        return (
            <div >
                <ProgressBar bsStyle='danger' now={hpNow}
                             id="dao-hpBar"
                             label="%(percent)s%" />
                <ProgressBar bsStyle='info' now={mpNow}
                             id="dao-mpBar"
                             label="%(percent)s%" />
            </div>
        );
    }
});

module.exports = CharHpMpBar;
