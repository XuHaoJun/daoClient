/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var OverlayTrigger = BS.OverlayTrigger;
var Popover = BS.Popover;

var Item = React.createClass({
  handleClick: function(event) {
    this.props.item.handleClick(event);
  },
  render: function() {
    var item = this.props.item;
    if (item) {
      var icons = this.props.icons;
      var iconSrc = icons[item.iconViewId]["src"];
      var itemBonus = _.map(item.bonusInfo, function(bVal, bKey) {
        if (_.isNull(bVal) || bVal == 0) {
          return null;
        } else {
          var keyName = bKey.charAt(0).toUpperCase() + bKey.substr(1);
          return (
            <p key={keyName}>{keyName + ": " + bVal}</p>
          );
        }
      });
      var itemInfo = (
        <Popover title={item.name}>
          { itemBonus }
        </Popover>
      );
      return this.transferPropsTo(
        <OverlayTrigger trigger="hover"
                        placement="bottom"
                        overlay={itemInfo}>
          <img onClick={this.handleClick}
               className='center-block item-img'
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
