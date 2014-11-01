/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Panel = BS.Panel;
var Draggable = require('react-draggable');
var Item = require('./Item');

var Shop = React.createClass({
  closeButtonClick: function(event) {
    var char = this.props.world.account.usingChar;
    if (_.isObject(char) == false) {
      return;
    }
    char.cancelOpeningShop();
  },
  componentWillUnmount: function() {
    this.props.world.account.usingChar.handleCanvasMouseenter();
  },
  handleDragEnd: function(event) {
    event.preventDefault();
    var char = this.props.world.account.usingChar;
    console.log(char);
    if (!_.isObject(char.draggingItem)) {
      return;
    }
    var item = char.draggingItem;
    console.log(item);
    char.sellItemToOpeningShop(item.baseId, item.slotIndex);
  },
  render: function() {
    var style = {'position': 'fixed',
                 'margin-top': '10%',
                 'margin-left': '40%',
                 'max-width': '30%'};
    var header = (
      <div className="handle-draggable">
        <span className="handle-draggable">
          {this.props.name}
        </span>
        <button
        type="button"
        className="close pull-right"
        onClick={this.closeButtonClick}
        dangerouslySetInnerHTML={{__html: '&times'}}
        />
      </div>
    );
    var items = this.props.items;
    var icons = this.props.world.assets.icon;
    var sellItemsList = _.map(items, function(item) {
      return (
        <Row key={item.baseId}
             className="dao-shopItem"
             style={{"max-width": '30%'}}
             onClick={function(event) {item.emit("click", event, "Shop");}}
             >
          <Colm md={4}>
            <Item item={item} icons={icons} viewName="Shop"/>
          </Colm>
          <Colm md={4}>
          </Colm>
          <Colm md={4}>
            <strong className="text-center center-block"
                    style={{'font-size': '24px'}}>
              {item.buyPrice}
            </strong>
          </Colm>
        </Row>
      );
    }, this);
    return (
      <Draggable handle=".handle-draggable,.panel-heading,.panel-title"
                 zIndex={51}>
        <Panel header={header}
               style={style}
               onDragEnd={this.handleDragEnd}
               onDrop={this.handleDragEnd}
               onDragOver={function(e) {e.preventDefault();}}
               className="noselect">
          <Grid>
            { sellItemsList }
          </Grid>
        </Panel>
      </Draggable>
    );
  }
});

module.exports = Shop;
