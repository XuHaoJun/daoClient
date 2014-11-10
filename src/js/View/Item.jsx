/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var OverlayTrigger = BS.OverlayTrigger;
var Popover = BS.Popover;
var Equipment = require('../Equipment');
var UseSelfItem = require('../UseSelfItem');

var itemDescription = {
  1: "初學者使用的長劍。",
  5001: "隨機回復 5~20 Hp。",
  5002: "回城。",
  5003: "學習火球術的捲軸。",
  10001: "普通的小石子。"
};

var Item = React.createClass({
  getDefaultProps: function() {
    return {
      popOverPlacement: "bottom"
    };
  },
  handleClick: function(event) {
    this.props.item.emit("click", event, this.props.viewName);
  },
  handleDragStart: function(event) {
    if (!_.isObject(this.props.item.owner)) {
      return;
    }
    // TODO
    // Add check owner is char instance type
    var char = this.props.item.owner;
    if (!_.isObject(char)) {
      return;
    }
    char.draggingItem = this.props.item;
    event.dataTransfer.setData("text/html", "workaround fix drag on firefox");
  },
  render: function() {
    var item = this.props.item;
    if (item) {
      var iconSrc = item.icon["src"];
      var itemBonus = null
      if (_.isObject(item.bonusInfo)) {
        itemBonus = _.map(item.bonusInfo, function(bVal, bKey) {
          if (_.isNull(bVal) || bVal == 0) {
            return null;
          } else {
            var keyName = bKey.charAt(0).toUpperCase() + bKey.substr(1);
            return (
              <p key={keyName}>{keyName + ": " + bVal}</p>
            );
          }
        });
        itemBonus = (
          <div>
            <h4>Bonus Info</h4>
            {itemBonus}
          </div>
        );
      }
      var itemDesc = null;
      if (!_.isUndefined(itemDescription[item.baseId])) {
        itemDesc = (
          <div>
            <h4>Description</h4>
            {itemDescription[item.baseId]}
          </div>
        );
      }
      var itemStackCount = null;
      if (_.isNumber(item.stackCount)) {
        itemStackCount = (
          <div>
            <h4>Stack Count</h4>
            { item.stackCount }
          </div>
        );
      }
      var itemInfo = (
        <Popover title={item.name}>
          { itemDesc }
          { itemBonus }
          { itemStackCount }
        </Popover>
      );
      var className = "dao-item";
      // TODO
      // add other check
      if (item instanceof Equipment) {
        className += " dao-equipment";
      } else if (item instanceof UseSelfItem) {
        className += " dao-useSelfItem";
      } else {
        className += " dao-etcItem";
      }
      return this.transferPropsTo(
        <OverlayTrigger trigger="hover"
                        placement={this.props.popOverPlacement}
                        overlay={itemInfo}>
          <div className={className + " " + this.props.className}
               onClick={this.handleClick}
               onDragStart={this.handleDragStart}
               draggable="true">
            <img draggable="false"
                 src={iconSrc} />
            <strong className="dao-item-stackCount" >
              {item.stackCount}
            </strong>
          </div>
        </OverlayTrigger>
      );
    } else {
      var style = {
        width: '34px',
        height: '34px',
        'background-color': '#B0B0B0'
      };
      return this.transferPropsTo(
        <div style={style}>
        </div>
      );
    }
  }
});

module.exports = Item;
