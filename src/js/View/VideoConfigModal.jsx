/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var BS = require('react-bootstrap');
var Input = BS.Input;
var Modal = BS.Modal;
var Button = BS.Button;

var VideoConfigModal = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        if (!_.isEqual(this.state, nextState)) {
            return true;
        }
        return false;
    },
    handleShadowEnableToggle: function(event) {
        this.props.world.account.usingChar.scene.renderer.shadowMapEnabled =
        !this.props.world.account.usingChar.scene.renderer.shadowMapEnabled;
    },
    componentWillUnmount: function () {
        this.props.world.account.usingChar.handleCanvasMouseenter();
    },
    render: function() {
        var checked = this.props.world.account.usingChar.scene.renderer.shadowMapEnabled;
        checked = (checked ? true : false);
        return this.transferPropsTo(
            <Modal title="Video Configuraiton">
                <div className="modal-body">
                    <Input type="checkbox" readOnly
                           label="ShadowEnable"
                           checked={checked}
                           onChange={this.handleShadowEnableToggle}/>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Cancle</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = VideoConfigModal;
