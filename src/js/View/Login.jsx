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
var Tooltip = BS.Tooltip;
var OverlayTrigger = BS.OverlayTrigger;
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

    componentWillUpdate: function(nextProps, nextState) {
        if (this.props.err != null) {
            nextProps.err = null;
        }
        if (this.props.success != null) {
            nextProps.success = null;
        }
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
            this.props.world.loginAccountGame(username, password);
        } else if(this.state.directlyWeb) {
            this.props.world.loginAccountWeb(username, password);
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

    handleLoginGameBySession: function() {
        this.props.world.loginAccountBySession();
    },

    renderOnlyLoginBySession: function() {
        var wellStyles = {maxWidth: 400, margin: '35% auto 10px'};
        return (
            <Grid fluid>
                <Row>
                    <Colm sm={6} md={4} mdOffset={4}>
                        <div className="well" style={wellStyles}>
                            <Button bsStyle='success'
                                    bsSize='large' block
                                    onClick={this.handleLoginGameBySession}>
                                Login To Game
                            </Button>
                        </div>
                    </Colm>
                </Row>
            </Grid>
        );
    },

    render: function() {
        if (this.props.world.lastUsername != '') {
            return this.renderOnlyLoginBySession();
        }
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
        var fbRouteName = "oauth2login?next=#loginByFacebook/";
        if (this.state.directlyGame) {
            fbRouteName += "Game";
        } else {
            fbRouteName += "Web";
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
                                        <OverlayTrigger placement="top" overlay={<Tooltip>將會直接登入遊戲中。</Tooltip>} >
                                                      <Input type='radio' value="Game" label="Game"
                                                             onClick={this.hanldeGameRadioButton}
                                                             readOnly
                                                             checked={this.state.directlyGame} />
                                        </OverlayTrigger>
                                    </Colm>
                                    <Colm md={6}>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>只有登入至網頁。</Tooltip>} >
                                                        { webRadioButton }
                                        </OverlayTrigger>
                                    </Colm>
                                </Row>
                                <Button bsStyle='primary' bsSize='large' block type='submit'>
                                    Login
                                </Button>
                            </form>
                            <a href={fbRouteName}>
                                <img src="assets/icon/web/fbLogin.png"
                                     className="dao-oauth2Icon" />
                            </a>
                            <img src="assets/icon/web/googleLogin.png"
                                 className="dao-oauth2Icon" />
                            <img src="assets/icon/web/gamerLogin.png"
                                 className="dao-oauth2Icon" />
                        </div>
                    </Colm>
                </Row>
                <Row style={{marginTop: "20px"}}>
                    <Colm md={4}>
                    </Colm>
                    <Colm md={4}>
                        <ModalTrigger modal={<RegisterAccountModal world={this.props.world} />} >
                            <Button className="center-block" bsStyle='success'>
                                Quick Register
                            </Button>
                        </ModalTrigger>
                    </Colm>
                </Row>
            </Grid>
        );
    }
});

module.exports = Login;
