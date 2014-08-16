/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var BS = require('react-bootstrap');
var PageHeader = BS.PageHeader;
var Grid = BS.Grid;
var Panel = BS.Panel;
var Row = BS.Row;
var Colm = BS.Col;

var BrowserDependCheck = React.createClass({
  render: function() {
    var dangerTitle = (
      <h3>Unsupport</h3>
    );
    var successTitle = (
      <h3>Support</h3>
    );
    var urlGen = function(name) {
      if (name == "indexeddb") {
        return "http://en.wikipedia.org/wiki/Indexed_Database_API";
      } else {
        return "#";
      }
    };
    var listGen = function(name) {
      return (
        <a className="list-group-item"
           href={ urlGen(name) }>
          { name }
        </a>
      );
    };
    var unsupportResult = _.select(_.keys(this.props.checkResult),
                                   function(c) { return this.props.checkResult[c] == false;},
                                   this);
    var unsupportList = _.map(unsupportResult, listGen);
    var supportResult = _.select(_.keys(this.props.checkResult),
                                 function(c) { return this.props.checkResult[c] == true;},
                                 this);
    var supportList = _.map(supportResult, listGen);
    return (
      <Grid fluid>
        <Row>
          <PageHeader>
            <div className='text-center'>
              Browser Dependencies Check
            </div>
          </PageHeader>
        </Row>
        <Row>
          <Colm md={4}>
          </Colm>
          <Colm md={4}>
            <Panel header={dangerTitle} bsStyle="danger">
              <div className="list-group">
                { unsupportList }
              </div>
            </Panel>
          </Colm>
        </Row>
        <Row>
          <Colm md={4}>
          </Colm>
          <Colm md={4}>
            <Panel header={successTitle} bsStyle="success">
              <div className="list-group">
                { supportList }
              </div>
            </Panel>
          </Colm>
        </Row>
      </Grid>
    );
  }
});

module.exports = BrowserDependCheck;
