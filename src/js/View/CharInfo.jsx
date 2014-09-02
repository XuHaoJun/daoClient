/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var TabbedArea = BS.TabbedArea;
var TabPane = BS.TabPane;
var Panel = BS.Panel;
var Draggable = require('react-draggable');

var CharInfo = React.createClass({
  render: function() {
    var display = (this.props.show ? 'block' : 'none');
    var style = {'position': 'fixed',
                 'margin-top': '10%',
                 'margin-left': '10%',
                 'display': display};
    var header = (
      <div className="handle-draggable">
        人物資訊
        <button
        type="button"
        className="close pull-right"
        onClick={this.props.closeButtonClick}
        dangerouslySetInnerHTML={{__html: '&times'}}
        />
      </div>
    );
    var char = this.props.world.account.usingChar;
    return (
      <Draggable handle=".handle-draggable,.panel-heading"
                 zIndex={50}>
        <Panel header={header} style={style}>
          <TabbedArea defaultActiveKey={1} center>
            <TabPane key={1} tab="基本資訊">
              <h4>Name:</h4>
              <p>{ char.name }</p>
              <h4>Level:</h4>
              <p>{ char.level }</p>
            </TabPane>
            <TabPane key={2} tab="主屬性">
              <p>Str: {char.str}</p>
              <p>Vit: {char.vit}</p>
              <p>Wis: {char.wis}</p>
              <p>spi: {char.spi}</p>
            </TabPane>
            <TabPane key={3} tab="副屬性">
              <p>def: {char.def}</p>
              <p>mdef: {char.mdef}</p>
              <p>atk: {char.atk}</p>
              <p>matk: {char.matk}</p>
              <p>maxHp: {char.maxHp}</p>
              <p>hp: {char.hp}</p>
              <p>maxMp: {char.maxMp}</p>
              <p>mp: {char.mp}</p>
            </TabPane>
          </TabbedArea>
        </Panel>
      </Draggable>
    );
  }
});

module.exports = CharInfo;
