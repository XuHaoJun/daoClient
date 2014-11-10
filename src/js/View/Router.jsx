/** @jsx React.DOM */

var Backbone = require('backbone');
var $ = require('jquery');
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
    };
  },
  componentWillUnmount: function () {
    Backbone.history.stop();
  },
  componentDidMount: function() {
    var BackboneRouter = Backbone.Router.extend({
      routes : {
        "login": this.routeLogin,
        "doc": this.routeDoc,
        "about": this.routeAbout,
        "home": this.routeHome,
      }
    });
    var router = new BackboneRouter();
    Backbone.history.start();
    router.navigate("login", {trigger: true});
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
  routeLogin: function() {
    this.setState({page: (
      <App>
        <Login world={this.props.world} />
      </App>
    )});
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
