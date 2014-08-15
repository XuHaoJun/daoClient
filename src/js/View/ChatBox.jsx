/** @jsx React.DOM */

var $ = require('jquery/dist/jquery');
var _ = require('lodash');
var React = require('react');

var ChatBox = React.createClass({
  getInitialState: function() {
    return {showTextInput: false};
  },
  componentDidMount: function() {
    $(document).on("keydown", this.handleToggleTextInput);
  },
  componentWillUnmount: function() {
    $(document).off("keydown", this.handleToggleTextInput);
  },
  handleToggleTextInput: function(event) {
    if (event.keyCode != 13) {
      return;
    }
    var textInputValue = (this.refs.textInput ?
                          this.refs.textInput.getDOMNode().value :
                          '');
    if (this.state.shoTextInput === false) {
      this.setState({showTextInput: !this.state.showTextInput});
      $(this.refs.textInput.getDOMNode()).focus();
    } else if (this.state.showTextInput && textnputValue === '') {
      this.setState({showTextInput: !this.state.showTextInput});
    }
  },
  handleSendMessage: function(e) {
    var textInputValue = (this.refs.textInput ?
                          this.refs.textInput.getDOMNode().value :
                          '');
    if (_.isObject(this.props.char) && textnputValue !== '') {
      this.props.char.talkScene(this.refs.textInput.getDOMNode().value);
      this.refs.textInput.getDOMNode().value = '';
    }
    return false;
  },
  render: function() {
    var key = 0;
    var messages = _.map(this.props.messages, function(msg) {
      return (
        <h4 key={key++} style={{'font-weight': 'bolder', color: 'yellow'}}>
          { "[" + msg.chatType + "] " + msg.talker + ": " + msg.content }
        </h4>
      );
    });
    var textInput = (this.state.showTextInput ?
                     <input ref='textInput' type='text'
                            className='form-control'/>
                                     : null);
    return (
      <div>
        { messages }
        <form onSubmit={this.handleSendMessage}>
          { textInput }
        </form>
      </div>
    );
  }
});

module.exports = ChatBox;
