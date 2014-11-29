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
    handleDrop: function(event) {
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
        var style = {position: 'fixed',
                     marginTop: '10%',
                     marginLeft: '40%',
                     maxWidth: '30%',
                     width: '30%'};
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
        var sellItemsList = _.map(items, function(item) {
            return (
                <Row key={item.baseId}
                     className="dao-shopItem"
                     onClick={function(event) {item.emit("click", event, "Shop");}}
                     >
                    <Colm md={4}>
                        <Item item={item} viewName="Shop"
                              showStackCount={false}
                              popoverPlacement="left"
                              disableClick={true} />
                    </Colm>
                    <Colm md={4}>
                    </Colm>
                    <Colm md={4}>
                        <strong className="text-center center-block"
                                style={{fontSize: '24px'}}>
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
                       onDrop={this.handleDrop}
                       onDragOver={function(e) {e.preventDefault();}}
                       className="noselect dao-shop">
                    <div className="dao-shopItems">
                        <Grid fluid>
                            { sellItemsList }
                        </Grid>
                    </div>
                </Panel>
            </Draggable>
        );
    }
});

module.exports = Shop;
