/** @jsx React.DOM */


var $ = require('jquery/dist/jquery');
var React = require('react');
var BS = require('react-bootstrap');
var Button = BS.Button;
var ButtonGroup = BS.ButtonGroup;

var CharContextmenu = module.exports = React.createClass({
    componentDidMount: function() {
        // for detect stop move!
        $(this.refs.contextmenu.getDOMNode()).on("mouseup", function(event) {
            this.props.char.handleCanvasMouseup(event);
        }.bind(this));
    },
    componentWillUnmount: function() {
        $(this.refs.contextmenu.getDOMNode()).off("mouseenter");
    },
    handleJoinParty: function(event) {
        event.preventDefault();
        var target = this.props.target;
        var char = this.props.char;
        char.joinPartyByCharName(target.name);
    },
    render: function() {
        var target = this.props.target;
        var char = this.props.char;
        var invitePartyButton = null;
        if (char.party !== null && target.party == null) {
            invitePartyButton = (<Button bsSize="small">邀請隊伍</Button>);
        }
        var joinPartyButton = null;
        if (target.party !== null && char.party == null) {
            joinPartyButton = (
                <Button bsSize="small" onClick={this.handleJoinParty}>
                    加入隊伍
                </Button>);
        }
        var style = {
            position: "absolute",
            left: this.props.position.x,
            top: this.props.position.y
        };
        return (
            <div className="dao-charContextmenu"
                 ref="contextmenu" style={style}>
                <ButtonGroup vertical>
                    {invitePartyButton}
                    {joinPartyButton}
                    <Button bsSize="small">交易</Button>
                    <Button bsSize="small">好友邀請</Button>
                </ButtonGroup>
            </div>
        );
    }
});

/* <Button bsStyle="primary" bsSize="small" >{target.name}</Button> */
