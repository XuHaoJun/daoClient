/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Panel = BS.Panel;
var TabbedArea = BS.TabbedArea;
var TabPane = BS.TabPane;
var Draggable = require('react-draggable');
var Item = require('./Item');
var ItemList = require('./ItemList');

var CharItems = React.createClass({
  render: function() {
    var display = (this.props.show ? 'block' : 'none');
    var style = {'position': 'fixed',
                 'margin-top': '10%',
                 'margin-left': '10%',
                 'display': display};
    var header = (
      <div className="handle-draggable">
        物品欄
        <button
        type="button"
        className="close pull-right"
        onClick={this.props.closeButtonClick}
        dangerouslySetInnerHTML={{__html: '&times'}}
        />
      </div>
    );
    var char = this.props.world.account.usingChar;
    var useSelfItems = (char ?
                        <ItemList items={char.items.useSelfItem}
                                  icons={this.props.world.assets.icon}
                                  step={6} /> :
                        null);
    var equipments = (char ?
                      <ItemList items={char.items.equipment}
                                icons={this.props.world.assets.icon}
                                step={6} /> :
                      null);
    var etcItems = (char ?
                    <ItemList items={char.items.etcItem}
                              icons={this.props.world.assets.icon}
                              step={6} /> :
                    null);
    return (
      <Draggable handle=".handle-draggable,.panel-heading"
                 zIndex={50}>
        <Panel header={header} style={style}>
          <TabbedArea defaultActiveKey={1} center>
            <TabPane key={1} tab="消耗">
              { useSelfItems }
            </TabPane>
            <TabPane key={2} tab="裝備">
              { equipments }
            </TabPane>
            <TabPane key={3} tab="其他">
              { etcItems }
            </TabPane>
          </TabbedArea>
        </Panel>
      </Draggable>
    );
  }
});

module.exports = CharItems;
