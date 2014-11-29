/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var OverlayTrigger = BS.OverlayTrigger;
var Popover = BS.Popover;

var skillName = {
    1: "火球術",
    2: "橫劈"
};

var skillDescription = {
    1: "發射出一顆火球。"
};

var Skill = React.createClass({
    getDefaultProps: function() {
        return {
            onDrop: function() {},
            level: 1,
            viewName: ""
        };
    },
    handleDoubleClick: function(event) {
        var char = this.props.world.account.usingChar;
        char.useSkillByBaseId(this.props.baseId);
    },
    handleDragStart: function(event) {
        var char = this.props.world.account.usingChar;
        char.draggingSkillBaseId = this.props.baseId;
        char.dragStartViewName = this.props.viewName;
        event.dataTransfer.setData("text/html", "workaround fix drag on firefox");
    },
    render: function() {
        var skillBaseId = this.props.baseId;
        var world = this.props.world;
        var iconSrc = world.assets.skillIcon[skillBaseId]["src"];
        var name = skillName[skillBaseId];
        var skillDesc = skillDescription[skillBaseId];
        var skillLevel = this.props.level.toString();
        var skillInfo = (
            <Popover title={name}>
                <h4>Level:</h4>
                { skillLevel }
                <h4>Description:</h4>
                { skillDesc }
            </Popover>
        );
        return (
            <OverlayTrigger trigger="hover"
                            placement="bottom"
                            overlay={skillInfo}>
                <img onDoubleClick={this.handleDoubleClick}
                     onDragStart={this.handleDragStart}
                     onDrop={this.props.onDrop}
                     className='center-block dao-skill'
                     draggable="true"
                     src={iconSrc} />
            </OverlayTrigger>
        );
    }
});

module.exports = Skill;
