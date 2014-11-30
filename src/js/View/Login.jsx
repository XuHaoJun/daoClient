/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Alert = BS.Alert;
var Input = BS.Input;
var Button = BS.Button;
var ButtonToolbar = BS.ButtonToolbar;
var ModalTrigger = BS.ModalTrigger;
var RegisterAccountModal = require('./RegisterAccountModal.js');

var Login = React.createClass({
    getDefaultProps: function() {
        return {
            err: null,
            success: null
        }
    },

    getInitialState: function() {
        return {
            alertVisible: true,
            directlyGame: true,
            directlyWeb: false
        };
    },
    handleLoginAccount: function(e) {
        e.preventDefault();
        var username = this.refs.username.getDOMNode().value.trim();
        var password = this.refs.password.getDOMNode().value.trim();
        if (!password || !username) {
            return;
        }
        this.refs.username.getDOMNode().value = '';
        this.refs.password.getDOMNode().value = '';
        if (this.state.directlyGame) {
            this.props.world.loginAccountGameByAjax(username, password);
        } else if(this.state.directlyWeb) {
            this.props.world.loginAccountWebByAjax(username, password);
        }
    },

    handleAlertDismiss: function() {
        this.setState({alertVisible: false});
    },

    hanldeGameRadioButton: function() {
        this.setState({directlyGame: true, directlyWeb: false});
    },

    hanldeWebRadioButton: function() {
        this.setState({directlyGame: false, directlyWeb: true});
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
        var webRadioButton = null;
        if (this.props.world.lastUsername == '') {
            webRadioButton = (
                <Input type='radio' value="Web" label="Web"
                       readOnly
                       onClick={this.hanldeWebRadioButton}
                       checked={this.state.directlyWeb} />
            );
        }
        return (
            <Grid fluid>
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
                                <Row>
                                    <Colm md={6}>
                                        <Input type='radio' value="Game" label="Game"
                                               onClick={this.hanldeGameRadioButton}
                                               readOnly
                                               checked={this.state.directlyGame} />
                                    </Colm>
                                    <Colm md={6}>
                                        { webRadioButton }
                                    </Colm>
                                </Row>
                                <Button bsStyle='primary' bsSize='large' block type='submit'>
                                    Login
                                </Button>
                            </form>
                            <a href="oauth2login?next=#loginFacebook">
                                <img src="assets/icon/web/fbLogin.png"
                                     style={{maxWidth: "54px", maxHeight: "54px", marginLeft: "10px"}} />
                            </a>
                        </div>
                    </Colm>
                </Row>
                <Row>
                    <Colm sm={6} md={4} mdOffset={4}>
                        <ButtonToolbar>
                            <ModalTrigger modal={<RegisterAccountModal world={this.props.world} />} >
                                <Button bsStyle='success'>Register</Button>
                            </ModalTrigger>
                        </ButtonToolbar>
                    </Colm>
                </Row>
            </Grid>
        );
    }
});

module.exports = Login;
