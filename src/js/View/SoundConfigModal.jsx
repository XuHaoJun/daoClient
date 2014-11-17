/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var BS = require('react-bootstrap');
var Input = BS.Input;
var Modal = BS.Modal;
var Button = BS.Button;

// TODO
// may be not use default audio player
var SoundConfigModal = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        if (!_.isEqual(this.state, nextState)) {
            return true;
        }
        return false;
    },
    componentDidMount: function() {
        var bgm = this.props.world.assets.audio.defaultBGM;
        bgm.loop();
        if (bgm) {
            bgm.sound.controls = true;
        }
        document.getElementById("defaultBackgroundMusic")
                .appendChild(bgm.sound);
    },
    componentWillUnmount: function() {
        var bgm = this.props.world.assets.audio.defaultBGM;
        bgm.sound.controls = false;
        var lastIsPlaying = !bgm.isPaused();
        var elem = document.getElementById("defaultBackgroundMusic");
        elem.removeChild(bgm.sound);// will auto pause after remove...
        // force continue play if was playing before remove
        if (bgm.isPaused() && lastIsPlaying) {
            bgm.play();
        }
        this.props.world.account.usingChar.handleCanvasMouseenter();
    },
    render: function() {
        return this.transferPropsTo(
            <Modal title="Sound Configuraiton">
                <div className="modal-body">
                    <h3>Background Music</h3>
                    <div id="defaultBackgroundMusic">
                    </div>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = SoundConfigModal;
