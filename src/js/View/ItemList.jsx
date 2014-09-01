/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Item = require('./Item');

var ItemList = React.createClass({
  render: function() {
    var items = this.props.items;
    var icons = this.props.icons;
    var colLength = this.props.step;
    var itemsGroup = _.groupBy(items, function(item, index) {
      return Math.floor(index / colLength);
    });
    var itemList = _.map(itemsGroup, function(rowItem) {
      var colItems = _.map(rowItem, function(item) {
        return (
          <Colm md={2}>
            <Item item={item} icons={icons} />
          </Colm>
        );
      });
      return (
        <Row className='items-gutter'>
          { colItems }
        </Row>
      );
    });
    return this.transferPropsTo(
      <div>
        { itemList }
      </div>
    );
  }
});

module.exports = ItemList;
