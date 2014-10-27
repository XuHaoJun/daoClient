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
    var viewName = this.props.viewName;
    var itemsGroup = _.groupBy(items, function(item, index) {
      return Math.floor(index / colLength);
    });
    var itemList = _.map(itemsGroup, function(rowItem, rowIndex) {
      var colItems = _.map(rowItem, function(item, colIndex) {
        return (
          <Colm key={colIndex} md={2}>
            <Item key={item} item={item} icons={icons} viewName={viewName}/>
          </Colm>
        );
      });
      return (
        <Row key={rowIndex} className='items-gutter'>
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
