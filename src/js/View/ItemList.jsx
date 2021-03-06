/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Item = require('./Item');
var EmptyItem = require('./EmptyItem');

var EmptyColmItem = React.createClass({
    shouldComponentUpdate: function() {
        return false;
    },
    render: function() {
        return (
            <Colm md={this.props.md}>
                <EmptyItem />
            </Colm>
        );
    }
});


var ItemList = React.createClass({
    render: function() {
        var items = this.props.items;
        var colLength = this.props.step;
        var viewName = this.props.viewName;
        var itemsGroup = _.groupBy(items, function(item, index) {
            return Math.floor(index / colLength);
        });
        var itemList = _.map(itemsGroup, function(rowItem, rowIndex) {
            var colItems = _.map(rowItem, function(item, colIndex) {
                if (item == null) {
                    return (
                        <EmptyColmItem key={colIndex} md={2} />
                    );
                } else {
                    return (
                        <Colm key={colIndex} md={2}>
                            <Item key={item} item={item} viewName={viewName}
                                  updateId={item.updateId}
                                  className="center-block" />
                        </Colm>
                    );
                }
            });
            return (
                <Row key={rowIndex} className='items-gutter'>
                    { colItems }
                </Row>
            );
        });
        return (
            <div>
                { itemList }
            </div>
        );
    }
});

module.exports = ItemList;
