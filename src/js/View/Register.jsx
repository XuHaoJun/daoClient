/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Input = BS.Input;
var Alert = BS.Alert;
var isEmail = require('valid-email');

var RegisterAccount = React.createClass({
    getDefaultProps: function() {
        return {
            err: null,
            success: null
        }
    },

    getInitialState: function() {
        return {
            alertVisible: true,
            username: '',
            usernameHelp: '',
            usernameValidation: '',
            password: '',
            passwordHelp: '',
            passwordValidation: '',
            passwordConfirm: '',
            email: ''
        };
    },
    handleAlertDismiss: function() {
        this.setState({alertVisible: false});
    },
    canRegister: function() {
        var refs = ['username', 'password', 'passwordConfirm', 'email'];
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
        if (this.canRegister()) {
            this.props.world.registerAccountByAjax(
                this.state.username,
                this.state.password,
                this.state.email);
        } else {
            alert("Can't register");
        }
    },
    handleUsernameChange: function() {
        var username = this.refs.username.getValue().trim();
        var length = username.length;
        var result;
        if (length > 3) {
            result = {usernameHelp: '',
                      usernameValidation: 'success'};
        } else if (length > 0) {
            var help = (<span style={{color: 'red'}}>名稱過短</span>);
            result = {usernameHelp: help,
                      usernameValidation: 'error'};
        } else if (length == 0) {
            result = {usernameHelp: '',
                      usernameValidation: ''};
        }
        result.username = username;
        this.setState(result);
    },
    handlePasswordChange: function() {
        var password = this.refs.password.getValue().trim();
        var length = password.length;
        var result;
        if (length > 3) {
            result = {passwordHelp: '',
                      passwordValidation: 'success'};
        } else if (length > 0) {
            var help = (<span style={{color: 'red'}}>密碼容易被猜到</span>);
            result = {passwordHelp: help,
                      passwordValidation: 'error'};
        } else if (length == 0) {
            result = {passwordHelp: '',
                      passwordValidation: ''};
        }
        result.password = password;
        this.setState(result);
    },
    handlePasswordValidationState: function() {
        var length = this.state.password.length;
        if (length > 3) return 'success';
        else if (length > 0) return 'error';
    },
    handleEmailChange: function() {
        this.setState({email:
                      this.refs.email.getValue().trim()});
    },
    handleEmailValidationState: function() {
        if (isEmail(this.state.email)) {
            return 'success';
        } else if (this.state.email.length > 0) {
            return 'error';
        }
        return '';
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

    componentWillUpdate: function(nextProps, nextState) {
        if (this.props.err != null) {
            nextProps.err = null;
        }
        if (this.props.success != null) {
            nextProps.success = null;
        }
    },

    render: function() {
        if (this.props.err || this.props.success) {
            this.state.alertVisible = true;
        }
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
            <Grid fluid>
                <Row>
                    <Colm md={3}></Colm>
                    <Colm md={9}>
                        { errAlert }
                        { successAlert }
                        <form className="center-block form-horizontal" onSubmit={this.handleRegisterAccount}>
                            <Input ref='username' label="Username" type="text"
                                   value={this.state.username}
                                   onChange={this.handleUsernameChange}
                                   bsStyle={this.state.usernameValidation}
                                   hasFeedback required
                                   help={this.state.usernameHelp}
                                   labelClassName="col-xs-2" wrapperClassName="col-xs-6"/>
                            <Input ref='password' label='Password' type='password'
                                   value={this.state.password}
                                   onChange={this.handlePasswordChange}
                                   help={this.state.passwordHelp}
                                   bsStyle={this.state.passwordValidation}
                                   labelClassName="col-xs-2" wrapperClassName="col-xs-6"
                                   hasFeedback required />
                            <Input ref='passwordConfirm' label='Password Confirm' type='password'
                                   value={this.state.passwordConfirm}
                                   onChange={this.handlePasswordConfirmChange}
                                   bsStyle={this.handlePasswordConfirmValidationState()}
                                   labelClassName="col-xs-2" wrapperClassName="col-xs-6"
                                   hasFeedback required />
                            <Input ref='email' label='Email Address' type='text'
                                   value={this.state.email}
                                   onChange={this.handleEmailChange}
                                   bsStyle={this.handleEmailValidationState()}
                                   labelClassName="col-xs-2" wrapperClassName="col-xs-6"
                                   hasFeedback required />
                            <Input type="submit" value="Submit"
                                   bsStyle="success"
                                   wrapperClassName="col-xs-offset-2 col-xs-10" />
                        </form>
                    </Colm>
                </Row>
            </Grid>
        );
    }
});

module.exports = RegisterAccount;
