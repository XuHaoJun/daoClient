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
var UsingEquips = require('../UsingEquips.js');

var CharUsingEquips = React.createClass({
  render: function() {
    var display = (this.props.show ? 'block' : 'none');
    var style = {'position': 'fixed',
                 'margin-top': '10%',
                 'margin-left': '25%',
                 'display': display};
    var header = (
      <div className="handle-draggable">
        <span className="handle-draggable">
          裝備欄
        </span>
        <button
        type="button"
        className="close pull-right"
        onClick={this.props.closeButtonClick}
        dangerouslySetInnerHTML={{__html: '&times'}}
        />
      </div>
    );
    var usingEquips = null;
    if (this.props.usingEquips) {
      usingEquips = _.map(this.props.usingEquips, function(eq, index) {
        if (eq) {
          return (<Item item={eq} viewName="CharUsingEquips"/>);
        } else {
          var boxStyle = {
            width: '34px',
            height: '34px',
            'background-color': '#EEE'
          };
          return (
            <div className='center-block' style={boxStyle}>
              { UsingEquips.hashTwName[index] }
            </div>
          );
        }
      });
      usingEquips = _.zipObject(UsingEquips.hashEnName, usingEquips);
    }
    var boxStyle = {
      width: '34px',
      height: '34px',
      'background-color': '#EEE'
    };
    return (
      <Draggable handle=".handle-draggable,.panel-heading,.panel-title"
                 zIndex={50}>
        <Panel header={header} style={style} className="noselect dao-charUsingEquips">
          <Grid fluid className="using-equips">
            <Row>
              <Colm md={4}>
                { usingEquips.shoulders }
              </Colm>
              <Colm md={4}>
                { usingEquips.head }
              </Colm>
              <Colm md={4}>
                { usingEquips.neck }
              </Colm>
            </Row>
            <Row>
              <Colm md={4}>
                { usingEquips.rightHand }
              </Colm>
              <Colm md={4}>
                { usingEquips.torso }
              </Colm>
              <Colm md={4}>
                { usingEquips.leftHand }
              </Colm>
            </Row>
            <Row>
              <Colm md={4}>
                { usingEquips.hands }
              </Colm>
              <Colm md={4}>
                { usingEquips.waist }
              </Colm>
              <Colm md={4}>
                { usingEquips.wrists }
              </Colm>
            </Row>
            <Row>
              <Colm md={4}>
                { usingEquips.leftFinger }
              </Colm>
              <Colm md={4}>
                { usingEquips.legs }
              </Colm>
              <Colm md={4}>
                { usingEquips.rightFinger }
              </Colm>
            </Row>
          </Grid>
        </Panel>
      </Draggable>
    );
  }
});

module.exports = CharUsingEquips;
