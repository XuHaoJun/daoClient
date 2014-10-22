/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Game2dUI = require('./Game2dUI');
var ChatBox = require('./ChatBox');
var NpcTalkBox = require('./NpcTalkBox');

var Game = React.createClass({
  getInitialState: function() {
    return {chatMessages: [],
            miniTarget: null,
            npcTalkBox: null,
            char: this.props.world.account.usingChar,
            charItems: this.props.world.account.usingChar.items,
            charUsingEquips: this.props.world.account.usingChar.usingEquips
    };
  },
  handleMiniTarget: function(target) {
    if (target != this.state.miniTarget) {
      this.setState({miniTarget: target});
    }
  },
  handleChar: function(char) {
    this.setState({char: char});
  },
  handleCharItems: function(charItems) {
    this.setState({charItems: charItems});
  },
  handleCharUsingEquips: function(charUsingEquips) {
    this.setState({charUsingEquips: charUsingEquips});
  },
  // TODO
  // rename to handleNewChatMessage
  handleChatMessage: function(msg) {
    this.state.chatMessages.push(msg);
    this.setState({chatMessages: this.state.chatMessages});
  },
  renderNpcTalkBox: function(config) {
    // TODO
    // add params to renderNpcTalkBox
    return (
      <NpcTalkBox world={this.props.world}
                  title={config.title}
                  content={config.content}
                  options={config.options}
                  />
    );
  },
  handleNpcTalkBox: function(npcTalkBoxConfig) {
    if (_.isNull(npcTalkBoxConfig)) {
      this.setState({npcTalkBox: null});
    } else {
      this.setState({npcTalkBox: this.renderNpcTalkBox(npcTalkBoxConfig)});
    }
  },
  render: function() {
    return (
      <div id="dao-game">
        <Grid fluid>
          <Row>
            <Colm md={12}>
              <Game2dUI world={this.props.world}
                        char={this.state.char}
                        charItems={this.state.char.items}
                        charUsingEquips={this.props.world.account.usingChar.usingEquips}
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
        <div style={{'margin-left': '25%', 'margin-top': '70%', 'max-width': '50%'}}>
          {this.state.npcTalkBox}
        </div>
      </div>
    );
  }
});

module.exports = Game;
