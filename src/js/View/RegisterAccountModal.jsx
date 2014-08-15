/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var BS = require('react-bootstrap');
var Input = BS.Input;
var Modal = BS.Modal;
var Button = BS.Button;

var RegisterAccountModal = React.createClass({
  getInitialState: function() {
    return {
      alertVisible: false,
      username: '',
      password: '',
      passwordConfirm: ''
    };
  },
  canRegister: function() {
    var refs = ['username', 'password', 'passwordConfirm'];
    var bsStyles = _.map(refs, function(elem) {
      return this.refs[elem].props.bsStyle;
    }.bind(this));
    var canRegister = _.all(bsStyles, function(bsStyle) {
      return bsStyle == 'success';
    });
    return canRegister;
  },
  handleRegisterAccount: function(e) {
    e.preventDefault();
    console.log(this.canRegister());
    if (this.canRegister()) {
      this.props.world.registerAccount(
        this.state.username,
        this.state.password);
      this.props.onRequestHide();
    }
  },
  handleUsernameChange: function() {
    this.setState({username:
                  this.refs.username.getValue().trim()});
  },
  handleUsernameValidationState: function() {
    var length = this.state.username.length;
    if (length > 3) return 'success';
    else if (length > 0) return 'error';
  },
  handlePasswordChange: function() {
    this.setState({password:
                  this.refs.password.getValue().trim()});
  },
  handlePasswordValidationState: function() {
    var length = this.state.password.length;
    if (length > 3) return 'success';
    else if (length > 0) return 'error';
  },
  handlePasswordConfirmChange: function() {
    this.setState({passwordConfirm:
                  this.refs.passwordConfirm.getValue().trim()});
  },
  handlePasswordConfirmValidationState: function() {
    var length = this.state.passwordConfirm.length;
    if (length > 3 && this.state.passwordConfirm == this.state.password) return 'success';
    else if (length > 0) return 'error';
  },
  render: function() {
    return (this.transferPropsTo(
      <Modal title="Register Account"
             backdrop="static" keyboard={false}>
        <form className="form-horizontal" onSubmit={this.handleRegisterAccount}>
          <div className="modal-body">
            <Input ref='username' label="Username" type="text"
                   value={this.state.username}
                   onChange={this.handleUsernameChange}
                   bsStyle={this.handleUsernameValidationState()}
                   hasFeedback required
                   labelClassName="col-xs-4" wrapperClassName="col-xs-8"/>
            <Input ref='password' label='Password' type='password'
                   value={this.state.password}
                   onChange={this.handlePasswordChange}
                   bsStyle={this.handlePasswordValidationState()}
                   labelClassName="col-xs-4" wrapperClassName="col-xs-8"
                   hasFeedback required />
            <Input ref='passwordConfirm' label='Password Confirm' type='password'
                   value={this.state.passwordConfirm}
                   onChange={this.handlePasswordConfirmChange}
                   bsStyle={this.handlePasswordConfirmValidationState()}
                   labelClassName="col-xs-4" wrapperClassName="col-xs-8"
                   hasFeedback required />
          </div>
          <div className="modal-footer">
            <Button bsStyle='success' type='submit'>
              Register
            </Button>
            <Button onClick={this.props.onRequestHide}>Cancle</Button>
          </div>
        </form>
      </Modal>
    ));
  }
});

module.exports = RegisterAccountModal;
