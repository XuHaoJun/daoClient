/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var OverlayTrigger = BS.OverlayTrigger;
var Popover = BS.Popover;
var Equipment = require('../Equipment');
var UseSelfItem = require('../UseSelfItem');

var itemDescription = {
  1: "初學者使用的長劍。"
};

var Item = React.createClass({
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
      var icons = this.props.icons;
      var iconSrc = icons[item.iconViewId]["src"];
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
      var itemInfo = (
        <Popover title={item.name}>
          { itemDesc }
        { itemBonus }
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
                        placement="top"
                        overlay={itemInfo}>
          <img onClick={this.handleClick}
               onDragStart={this.handleDragStart}
               className={'center-block' + className}
               draggable="true"
               src={iconSrc} />
        </OverlayTrigger>
      );
    } else {
      var style = {
        width: '34px',
        height: '34px',
        'background-color': '#B0B0B0'
      };
      return this.transferPropsTo(
        <div className='center-block' style={style}>
        </div>
      );
    }
  }
});

module.exports = Item;