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
var Shop = require('./Shop');
var ItemLabel = require('./ItemLabel');

var Game = React.createClass({
  getInitialState: function() {
    return {chatMessages: [],
            inSceneItemLabels: null,
            miniTarget: null,
            npcTalkBox: null,
            shop: null,
            char: this.props.world.account.usingChar,
            charItems: this.props.world.account.usingChar.items,
            charSkillBaseIds: this.props.world.account.usingChar.skillBaseIds,
            charUsingEquips: this.props.world.account.usingChar.usingEquips
    };
  },
  handleMiniTarget: function(target, forceUpdate) {
    if (forceUpdate || target != this.state.miniTarget) {
      this.setState({miniTarget: target});
    }
  },
  handleChar: function(char) {
    this.setState({char: char});
  },
  handleCharSkillBaseIds: function(sids) {
    this.setState({charSkillBaseIds: sids});
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
  renderInSceneItemLabels: function(items) {
    var lables =  _.map(items, function(item) {
      return (
        <ItemLabel key={item.id} item={item} position={item.screenXY()} />
      );
    });
    return lables;
  },
  handleInSceneItems: function(inSceneItems) {
    this.setState({inSceneItemLabels:
                  this.renderInSceneItemLabels(inSceneItems)});
  },
  handleNpcTalkBox: function(npcTalkBoxConfig) {
    if (_.isNull(npcTalkBoxConfig)) {
      this.setState({npcTalkBox: null});
    } else {
      this.setState({npcTalkBox: this.renderNpcTalkBox(npcTalkBoxConfig)});
    }
  },
  renderShop: function(shopConfig) {
    return (
      <Shop name={shopConfig.name}
            items={shopConfig.items}
            world={this.props.world}
            />
    );
  },
  handleShop: function(shopConfig) {
    if (_.isNull(shopConfig)) {
      this.setState({shop: null});
    } else {
      this.setState({shop: this.renderShop(shopConfig)});
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
                        charItems={this.state.charItems}
                        charSkillBaseIds={this.state.charSkillBaseIds}
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
        {this.state.npcTalkBox}
        {this.state.shop}
        {this.state.inSceneItemLabels}
      </div>
    );
  }
});

module.exports = Game;
