/** @jsx React.DOM */

var $ = require('jquery/dist/jquery');
var _ = require('lodash');
var React = require('react');
var ChatMessage = require('./ChatMessage.js');

var ChatBox = React.createClass({
    getDefaultProps: function() {
        return {
            maxMessage: 25
        };
    },
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
        // enter key
        if (event.keyCode != 13) {
            return;
        }
        var textInputValue = (this.refs.textInput ?
                              this.refs.textInput.getDOMNode().value :
                              '');
        if (this.state.showTextInput === false) {
            this.setState({showTextInput: !this.state.showTextInput});
            $(this.refs.textInput.getDOMNode()).focus();
        } else if (this.state.showTextInput && document.activeElement != this.refs.textInput.getDOMNode()) {
            $(this.refs.textInput.getDOMNode()).focus();
        } else if (this.state.showTextInput && textInputValue === '') {
            this.setState({showTextInput: false});
        }
    },
    componentDidUpdate: function() {
        var chatBoxMessagesDOM = this.refs.chatBoxMessages.getDOMNode();
        chatBoxMessagesDOM.scrollTop = chatBoxMessagesDOM.scrollHeight;
    },
    handleSendMessage: function(e) {
        e.preventDefault();
        var textInputValue = (this.refs.textInput ?
                              this.refs.textInput.getDOMNode().value :
                              '');
        if (_.isObject(this.props.char) && textInputValue !== '') {
            this.props.char.talkScene(this.refs.textInput.getDOMNode().value);
            this.refs.textInput.getDOMNode().value = '';
        }
    },
    render: function() {
        var messages = this.props.messages.slice(-1 * this.props.maxMessage).map(function(msg, i) {
            return (
                <ChatMessage key={i}
                             time={msg.time}
                             chatType={msg.chatType}
                             talker={msg.talker}
                             content={msg.content} />
            );
        });
        var displayTextInput = (this.state.showTextInput ?
                                'block' : 'none');
        return (
            <div ref='chatBox'
                 className='chat-box'>
                <div ref='chatBoxMessages'
                     id='dao-chatMessages'
                     className='chat-messages'>
                    { messages }
                </div>
                <form onSubmit={this.handleSendMessage}>
                    <input ref='textInput' type='text'
                           style={{display: displayTextInput}}
                           className='form-control'/>
                </form>
            </div>
        );
    }
});

module.exports = ChatBox;
