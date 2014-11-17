/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Row = BS.Row;
var Colm = BS.Col;
var Skill = require('./Skill.js');
var Item = require('./Item.js');

var SkillHotKey = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        if (!_.isEqual(this.props, nextProps) ||
            !_.isEqual(this.state, nextState) ) {
                return true;
        }
        return false;
    },
    handleEmptyDrop: function(event) {
        event.preventDefault();
        var char = this.props.world.account.usingChar;
        var baseId = char.draggingSkillBaseId;
        if (char.hotKeys.skill[this.props.index] == null) {
            char.hotKeys.skill[this.props.index] = {skillBaseId: baseId};
        } else {
            char.hotKeys.skill[this.props.index].skillBaseId = baseId;
        }
        if (this.props.index == 0) {
            char.setLeftSkillHotKey(baseId);
        } else {
            char.setRightSkillHotKey(baseId);
        }
    },
    handleSkillDragStart: function(event) {
    },
    render: function() {
        if (this.props.hotKey === null || this.props.hotKey.skillBaseId <= 0) {
            return (
                <div className="dao-emptySkillHotKey"
                     onDrop={this.handleEmptyDrop}
                     onDragOver={function(e) {e.preventDefault();}}
                     >
                </div>
            );
        } else {
            return (
                <Skill baseId={this.props.hotKey.skillBaseId}
                       world={this.props.world}
                       onDragOver={function(e) {e.preventDefault();}}
                       />
            );
        }
    }
});

var NormalHotKey = React.createClass({
    handleDrop: function(event) {
        event.preventDefault();
        var char = this.props.world.account.usingChar;
        var item = char.draggingItem;
        if (item.slotIndex != -1) {
            char.hotKeys.normal[this.props.index].itemBaseId = item.baseId;
            char.hotKeys.normal[this.props.index].slotIndex = item.slotIndex;
            char.setNormalHotKey(this.props.index, item.baseId, item.slotIndex);
        }
    },
    renderEmpty: function() {
        return (
            <div className="dao-emptyItemHotKey"
                 onDrop={this.handleDrop}
                 onDragOver={function(e) {e.preventDefault();}}
                 >
            </div>
        );
    },
    render: function() {
        if (this.props.hotKey === null || this.props.hotKey.itemBaseId <= 0) {
            return this.renderEmpty();
        } else {
            var char = this.props.world.account.usingChar;
            var itemBaseId = this.props.hotKey.itemBaseId;
            var slotIndex = this.props.hotKey.slotIndex;
            var item;
            if (itemBaseId <= 5000) {
                item = char.items.equipment[slotIndex];
            } else {
                item = char.items.useSelfItem[slotIndex];
            }
            if (item == null) {
                return this.renderEmpty();
            }
            return (
                <Item item={item}
                      className="dao-hotKey-item"
                      updateId={item.updateId}
                      viewName="HotKeys" />
            );
        }
    }
});

var HotKeys = React.createClass({
    handleTriggerNormalHotKey: function(event) {
        var normalKeyIndex;
        switch(event.keyCode) {
            case 112:
                normalKeyIndex = 0;
                event.preventDefault();
                break;
            case 113:
                normalKeyIndex = 1;
                break;
            case 114:
                normalKeyIndex = 2;
                event.preventDefault();
                break;
            case 115:
                normalKeyIndex = 3;
                break;
            default:
                return;
        }
        var char = this.props.world.account.usingChar;
        var hotKeys = this.props.hotKeys;
        var itemBaseId = hotKeys.normal[normalKeyIndex].itemBaseId;
        var slotIndex = hotKeys.normal[normalKeyIndex].slotIndex;
        var item = null;
        if (itemBaseId <= 5000) {
            item = char.items.equipment[slotIndex];
        } else {
            item = char.items.useSelfItem[slotIndex];
        }
        if (item == null) {
            return;
        }
        item.emit("click", event, "HotKeys");
    },
    componentDidMount: function() {
        $(document).on("keydown", this.handleTriggerNormalHotKey);
    },
    componentWillUnmount: function() {
        $(document).off("keydown", this.handleTriggerNormalHotKey);
    },
    render: function() {
        var hotkeys = this.props.hotKeys;
        var normalHotKeys = _.map(hotkeys.normal, function(nkey, index) {
            return (
                <Colm md={2} key={index}>
                    <NormalHotKey hotKey={nkey}
                                  world={this.props.world}
                                  index={index} />
                </Colm>
            );
        }, this);
        var skillHotKeys = _.map(hotkeys.skill, function(skey, index) {
            return (
                <Colm md={2} key={index}>
                    <SkillHotKey hotKey={skey}
                                 world={this.props.world}
                                 index={index} />
                </Colm>
            );
        }, this);
        return (
            <Row className='gutter-2px dao-hotKeys'>
                { normalHotKeys }
                { skillHotKeys }
            </Row>
        );
    }
});

module.exports = HotKeys;
