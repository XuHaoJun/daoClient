/** @jsx React.DOM */

var $ = window.jQuery = window.$ = require('jquery/dist/jquery');
require('mousestop');
require('bootstrap/dist/js/bootstrap');

module.exports = {
    App: require('./App.js'),
    ChatBox: require('./ChatBox'),
    Game2dUI: require('./Game2dUI'),
    Game: require('./Game'),
    Loading: require('./Loading'),
    Login: require('./Login'),
    MiniTargetInfo: require('./MiniTargetInfo'),
    RegisterAccountModal: require('./RegisterAccountModal'),
    SelectChar: require('./SelectChar'),
    SoundConfigModal: require('./SoundConfigModal'),
    Item: require('./Item'),
    CharItems: require('./CharItems'),
    CharInfo: require('./CharInfo'),
    Shop: require('./Shop'),
    VideoConfigModal: require('./VideoConfigModal'),
    BrowserDependCheck: require('./BrowserDependCheck')
};
