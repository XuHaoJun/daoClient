/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Row = BS.Row;
var Colm = BS.Col;
var Alert = BS.Alert;
var Button = BS.Button;
var ModalTrigger = BS.ModalTrigger;
var RegisterAccountModal = require('./RegisterAccountModal.js');

var Login = React.createClass({
  getInitialState: function() {
    return {
      alertVisible: true
    };
  },
  handleLoginAccount: function(e) {
    var username = this.refs.username.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    if (!password || !username) {
      return;
    }
    this.refs.username.getDOMNode().value = '';
    this.refs.password.getDOMNode().value = '';
    this.props.world.loginAccount(username, password);
    return false;
  },
  handleAlertDismiss: function() {
    this.setState({alertVisible: false}, function() {
      this.state.alertVisible = true;
    });
  },
  render: function() {
    var errAlert = null;
    var successAlert = null;
    if (this.props.err && this.state.alertVisible) {
      errAlert = (
        <Alert bsStyle="danger" onDismiss={ this.handleAlertDismiss }>
          { this.props.err }
        </Alert>
      );
    }
    if (this.props.success && this.state.alertVisible) {
      successAlert = (
        <Alert bsStyle="success" onDismiss={ this.handleAlertDismiss }>
          { this.props.success }
        </Alert>
      );
    }
    return (
      <div className='container-fluid'>
        <Row>
          <Colm sm={6} md={4} mdOffset={4}>
            <h1 className="text-center login-title">Login to Dao!</h1>
            { errAlert }
            { successAlert }
            <div className='account-wall'>
              <form className='form-signin' onSubmit={this.handleLoginAccount} >
                <input ref='username' name='username' placeholder='username'
                       type='text' className='form-control' autoFocus required />
                <input ref='password' name='password' placeholder='password'
                       type='password' className='form-control' required />
                <Button bsStyle='primary' bsSize='large' block type='submit'>Login</Button>
              </form>
            </div>
          </Colm>
        </Row>
        <Row>
          <Colm sm={6} md={4} mdOffset={4}>
            <ModalTrigger modal={<RegisterAccountModal world={this.props.world} />} >
              <Button bsStyle='success'>Register</Button>
            </ModalTrigger>
          </Colm>
        </Row>
      </div>
    );
  }
});

module.exports = Login;
