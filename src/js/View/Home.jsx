/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Jumbotron = BS.Jumbotron;

var Home = module.exports = React.createClass({
  render: function() {
    return (
      <div className="container">
        <Jumbotron>
          <h1>Test Page</h1>
        </Jumbotron>
      </div>
    );
  }
});
