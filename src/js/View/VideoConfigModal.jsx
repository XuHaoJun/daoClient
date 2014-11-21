/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var BS = require('react-bootstrap');
var Input = BS.Input;
var Modal = BS.Modal;
var Button = BS.Button;

var VideoConfigModal = React.createClass({
    getInitialState: function() {
        return {
            shadowEnableCheck: this.props.world.renderer.shadowMapEnabled,
            devicePixelRatioValue: this.props.world.renderer.devicePixelRatio
        };
    },
    componentWillUnmount: function () {
        this.props.world.account.usingChar.handleCanvasMouseenter();
    },
    handleShadowEnableToggle: function(event) {
        this.props.world.renderer.shadowMapEnabled = !this.props.world.renderer.shadowMapEnabled;
        this.setState({shadowEnableCheck:
                      this.props.world.renderer.shadowMapEnabled});
    },
    handleDevicePixelRatioChange: function(event) {
        var ratio = parseFloat(this.refs.devicePixelRatioRange.getValue().trim());
        this.props.world.renderer.devicePixelRatio = ratio;
        this.props.world.account.usingChar.scene.threeResize.trigger();
        this.setState({devicePixelRatioValue: ratio});
    },
    render: function() {
        return (
            <Modal title="Video Configuraiton"
                   onRequestHide={this.props.onRequestHide}>
                <div className="modal-body">
                    <Input type="checkbox" readOnly
                           label="ShadowEnable"
                           checked={this.state.shadowEnableCheck}
                           onChange={this.handleShadowEnableToggle}/>
                    <Input type="range"
                           ref="devicePixelRatioRange"
                           min={0} max={1}
                           step={0.1}
                           value={this.state.devicePixelRatioVale}
                           defaultValue={this.props.world.renderer.devicePixelRatio}
                           onChange={this.handleDevicePixelRatioChange}
                           label={"devicePixelRatio (" + this.state.devicePixelRatioValue +")"} />
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Cancle</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = VideoConfigModal;
