/** @jsx React.DOM */

var Backbone = require('backbone');
var $ = require('jquery');
var React = require('react');
var Login = require('./Login');
var DaoDocument = require('./DaoDocument');
var About = require('./About');
var Home = require('./Home');
var Register = require('./Register.js');
var AccountProfile = require('./AccountProfile.js');
var App = require('./App');
Backbone.$ = $;

var Router = module.exports = React.createClass({
    getInitialState: function () {
        return {
            router: null,
            page: null,

            loginError: null,
            successRegister: null
        };
    },

    componentWillUnmount: function () {
        Backbone.history.stop();
    },

    componentDidMount: function() {
        var routes = {
            "login": this.routeLogin,
            "loginFacebook": this.routeLoginFacebook,
            "loginWeb": this.routeLoginWeb,
            "doc": this.routeDoc,
            "about": this.routeAbout,
            "register": this.routeRegister,
            "home": this.routeHome,
            "accountProfile": this.routeAccountProfile,
            "accountProfile/:page": this.routeAccountProfile
        }
        var BackboneRouter = Backbone.Router.extend({
            routes: routes
        });
        var router = new BackboneRouter();
        Backbone.history.start();
        var name = window.location.hash.substring(1, window.location.hash.length);
        if (window.location.hash) {
            router.navigate(name, {trigger: true});
        } else {
            router.navigate("login", {trigger: true});
        }
        this.state.router = router;
    },

    currentRouteName: function() {
        var name = window.location.hash.substring(1, window.location.hash.length);
        return name;
    },

    handleSuccessRegisterAccount: function(msg) {
        this.state.successRegister = msg;
        var name = this.currentRouteName();
        if (name == "login") {
            this.routeLogin();
        } else if (name == "register") {
            this.state.router.navigate("login", {trigger: true});
        }
    },
    handleErrorLoginAccount: function(err) {
        this.state.loginError = err;
        var name = this.currentRouteName();
        if (name == "login") {
            this.routeLogin();
        } else if (name == "register") {
            this.routeRegister();
        }
    },

    routeLogin: function() {
        this.setState({page: (
            <App navActiveKey="login" world={this.props.world} >
                <Login world={this.props.world}
                       err={this.state.loginError}
                       success={this.state.successRegister} />
            </App>
        )}, function() {
            this.state.loginError = null;
            this.state.successRegister = null;
        });
    },

    routeRegister: function() {
        this.setState({page: (
            <App world={this.props.world} navActiveKey="register">
                <Register world={this.props.world}
                          err={this.state.loginError}
                          success={this.state.successRegister} />
            </App>
        )}, function() {
            this.state.loginError = null;
            this.state.successRegister = null;
        });
    },

    routeLoginWeb: function() {
    },

    routeAccountProfile: function(page) {
        if (!page) {
            page = "profile"
        }
        this.setState({page: (
            <App world={this.props.world}
                 navActiveKey="">
                <AccountProfile world={this.props.world}
                                navActiveKey={page} />
            </App>
        )});
    },

    handleForceUpdate: function() {
        this.forceUpdate();
    },

    routeLoginFacebook: function() {
        var world = this.props.world;
        $.getJSON("account/newByFacebook", function() {
            $.getJSON("account/loginGameByFacebook", function(data) {
                console.log(data);
                world.loginAccount(data.username, data.password);
            });
        });
    },

    routeHome: function() {
        this.setState({page: (
            <App navActiveKey="home" world={this.props.world}>
                <Home />
            </App>
        )});
    },

    routeDoc: function() {
        this.setState({page: (
            <App navActiveKey="doc" world={this.props.world}>
                <DaoDocument />
            </App>
        )});
    },

    routeAbout: function() {
        this.setState({page: (
            <App navActiveKey="about" world={this.props.world}>
                <About />
            </App>
        )});
    },

    render: function() {
        return this.state.page;
    }
});
