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
        if (!_.isEqual(this.state, nextState)) {
            return true;
        }
        if (_.isEqual(this.props.skillBaseIds, nextProps.skillBaseIds)) {
            return false;
        }
        return nextProps.shouldUpdate;
    },
    render: function() {
        var world = this.props.world;
        var skillBaseIds = this.props.skillBaseIds;
        var skills = _.map(skillBaseIds, function(sid) {
            return (
                <Skill key={sid} baseId={sid} world={world}/>
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
        var style = {'position': 'fixed',
                     'margin-top': '7%',
                     'margin-left': '30%',
                     'display': display};
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
