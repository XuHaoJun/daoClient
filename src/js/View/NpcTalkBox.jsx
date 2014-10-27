/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Modal = BS.Modal;
var Button = BS.Button;

var npcTalkButton = React.createClass({
  handleClick: function() {
    var char = this.props.char;
    char.responseTalkingNpc(this.props.index);
  },
  render: function() {
    return (
      <Button onClick={this.handleClick}>
        {this.props.name}
      </Button>
    );
  }
});

var NpcTalkBox = React.createClass({
  handleHide: function() {
    var char = this.props.world.account.usingChar;
    char.cancelTalkingNpc();
  },
  componentWillUnmount: function () {
    this.props.world.account.usingChar.handleCanvasMouseenter();
  },
  render: function() {
    var char = this.props.world.account.usingChar;
    var buttons = _.map(this.props.options, function(opt, index) {
      return (
        <npcTalkButton key={index}
                       name={opt.name}
                       index={index}
                       char={char}
                       />
      );
    });
    return (
      <Modal title={this.props.title}
             backdrop={false}
             animation={false}
             onRequestHide={this.handleHide}
             zIndex={999}
             >
        <div className="modal-body">
          <div className="npcTalkBoxContent"
               dangerouslySetInnerHTML={{
               __html: this.props.content
               }}>
          </div>
        </div>
        <div className="modal-footer">
          { buttons }
        </div>
      </Modal>
    );
  }
});

module.exports = NpcTalkBox;
