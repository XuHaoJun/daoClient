/** @jsx React.DOM */

var _ = require('lodash');
var $ = require('jquery/dist/jquery');
var React = require('react');
var Draggable = require('react-draggable');
var BS = require('react-bootstrap');
var Button = BS.Button;
var Input = BS.Input;
var Panel = BS.Panel;

var CreatePartyForm = React.createClass({
    componentDidMount: function() {
        $(this.refs.partyNameInput.getInputDOMNode()).focus();
    },
    handleCreatParty: function(e) {
        e.preventDefault();
        var partyName = this.refs.partyNameInput.getValue();
        if (_.isEmpty(partyName)) {
            return;
        }
        this.props.char.createParty(partyName);
        this.refs.partyNameInput.getInputDOMNode().value = '';
    },
    render: function() {
        return (
            <form onSubmit={this.handleCreatParty}>
                <Input ref="partyNameInput"
                       type="text" label="隊伍名稱"
                       defaultValue="" />
                <Input type="submit" value="建立隊伍" />
            </form>
        );
    }
});

var PartyInfo = React.createClass({
    render: function() {
        var party = this.props.party;
        var membersList = _.map(party.memberNames,  function(name, i) {
            return (
                <p key={i}>{name}</p>
            );
        });
        return (
            <div>
                <Button>離開隊伍</Button>
                <h3>隊伍名稱：</h3>
                <p>{party.name}</p>
                <h3>隊員：</h3>
                {membersList}
            </div>
        );
    }
});

var CharParty = module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            show: false
        };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if ((!nextProps.show && !this.props.show) ||
            (nextProps.party === null &&
             this.props.party === null && this.props.show == nextProps.show) ||
            (nextProps.party && this.props.party &&
             nextProps.party.uuid == this.props.party.uuid &&
             this.props.show == nextProps.show)) {
                 return false;
        }
        return true;
    },
    render: function() {
        var header = (
            <div className="handle-draggable">
                <span className="handle-draggable">
                    隊伍欄
                </span>
                <button
                type="button"
                className="close pull-right"
                onClick={this.props.closeButtonClick}
                dangerouslySetInnerHTML={{__html: '&times'}}
                />
            </div>
        );
        var display = (this.props.show ? 'block' : 'none');
        var style = {position: 'fixed',
                     marginTop: '15%',
                     marginLeft: '70%',
                     display: display};
        var createPartyForm = null;
        if (this.props.party == null) {
            createPartyForm = (<CreatePartyForm char={this.props.char}/>);
        }
        var partyInfo = null;
        if (_.isObject(this.props.party)) {
            partyInfo = (<PartyInfo party={this.props.party} />);
        }
        return (
            <Draggable handle=".handle-draggable,.panel-heading,.panel-title"
                       zIndex={50}>
                <Panel header={header} style={style} className="noselect dao-charParty" >
                    { createPartyForm }
                    { partyInfo }
                </Panel>
            </Draggable>
        );
    }
});
