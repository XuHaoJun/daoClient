/** @jsx React.DOM */

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var Login = require('./Login');
var DaoDocument = require('./DaoDocument');
var About = require('./About');
var Home = require('./Home');
var App = require('./App');
Backbone.$ = $;

var Router = module.exports = React.createClass({
  getInitialState: function () {
    return {
      page: null,

      loginError: null,
      successRegiste: null
    };
  },

  componentWillUnmount: function () {
    Backbone.history.stop();
  },

  componentDidMount: function() {
    var routes = {
      "login": this.routeLogin,
      "doc": this.routeDoc,
      "about": this.routeAbout,
      "home": this.routeHome,
    }
    var BackboneRouter = Backbone.Router.extend({
      routes: routes
    });
    var router = new BackboneRouter();
    Backbone.history.start();
    var name = window.location.hash.substring(1, window.location.hash.length);
    if (window.location.hash && _.indexOf(_.keys(routes), name) != -1) {
      router.navigate(name, {trigger: true});
    } else {
      router.navigate("login", {trigger: true});
    }
  },

  routeHome: function() {
    this.setState({page: (
      <App>
        <Home />
      </App>
    )});
  },

  routeDoc: function() {
    this.setState({page: (
      <App>
        <DaoDocument />
      </App>
    )});
  },

  handleSuccessRegisterAccount: function(msg) {
    this.state.successRegister = msg;
    this.routeLogin();
  },
  handleErrorLoginAccount: function(err) {
    this.state.loginError = err;
    this.routeLogin();
  },
  routeLogin: function() {
    this.setState({page: (
      <App>
        <Login world={this.props.world}
               err={this.state.loginError}
               success={this.state.successRegister} />
      </App>
    )}, function() {
      this.state.loginError = null;
      this.state.successRegister = null;
    });
  },

  routeAbout: function() {
    this.setState({page: (
      <App>
        <About />
      </App>
    )});
  },

  render: function() {
    return this.state.page;
  },
});
