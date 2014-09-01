/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Game2dUI = require('./Game2dUI');
var ChatBox = require('./ChatBox');

var Game = React.createClass({
  getInitialState: function() {
    return {chatMessages: [], miniTarget: null};
  },
  handleMiniTarget: function(target) {
    if (target != this.state.miniTarget) {
      this.setState({miniTarget: target});
    }
  },
  handleChatMessage: function(msg) {
    this.state.chatMessages.push(msg);
    this.setState({chatMessages: this.state.chatMessages});
  },
  render: function() {
    return (
      <div id="dao-game">
        <Grid fluid>
          <Row>
            <Colm md={12}>
              <Game2dUI world={this.props.world}
                        miniTarget={this.state.miniTarget} />
            </Colm>
          </Row>
        </Grid>
        <div className="navbar navbar-fixed-bottom"
             style={{'margin-left': '10px', 'max-width': '20%'}}>
          <ChatBox
          messages={this.state.chatMessages}
                   char={this.props.world.account.usingChar} />
        </div>
      </div>
    );
  }
});

module.exports = Game;
