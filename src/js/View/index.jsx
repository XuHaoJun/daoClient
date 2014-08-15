/** @jsx React.DOM */

var $ = window.jQuery = window.$ = require('jquery/dist/jquery');
require('bootstrap/dist/js/bootstrap');

module.exports = {
  ChatBox: require('./ChatBox'),
  Game2dUI: require('./Game2dUI'),
  Game: require('./Game'),
  Loading: require('./Loading'),
  Login: require('./Login'),
  MiniTargetInfo: require('./MiniTargetInfo'),
  RegisterAccountModal: require('./RegisterAccountModal'),
  SelectChar: require('./SelectChar'),
  ThreeCanvas: require('./ThreeCanvas')
};
