/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Panel = BS.Panel;
var Draggable = require('react-draggable');
var Skill = require('./Skill');

var CharSkills = React.createClass({
    getDefaultProps: function() {
        return {
            shouldUpdate: true
        };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if (!nextProps.show && !this.props.show) {
            return false;
        }
        if (this.props.show != nextProps.show ||
            !_.isEqual(this.props, nextProps) ||
            !_.isEqual(this.state, nextState) ) {
                return true;
        }
        return nextProps.shouldUpdate;
    },
    render: function() {
        var world = this.props.world;
        var learnedSkills = this.props.learnedSkills;
        var skills = _.map(learnedSkills, function(level, id) {
            return (
                <Skill key={id} baseId={id}
                       level={level} world={world}/>
            );
        }, this);
        var header = (
            <div className="handle-draggable">
                <span className="handle-draggable">
                    人物技能
                </span>
                <button
                type="button"
                className="close pull-right"
                onClick={this.props.closeButtonClick}
                dangerouslySetInnerHTML={{__html: '&times'}}
                />
            </div>
        );
        var display = (this.props.show ? 'block' : 'none');
        var style = {position: 'fixed',
                     marginTop: '7%',
                     marginLeft: '30%',
                     display: display};
        return (
            <Draggable handle=".handle-draggable,.panel-heading,.panel-title"
                       zIndex={50}>
                <Panel header={header} style={style} className="noselect">
                    { skills }
                </Panel>
            </Draggable>
        );
    }
});

module.exports = CharSkills;
