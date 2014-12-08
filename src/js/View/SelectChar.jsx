/** @jsx React.DOM */

"use strict";

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Input = BS.Input;
var Button = BS.Button;
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;

var SelectChar = React.createClass({
    getInitialState: function() {
        return {selectedCharSlot: 0};
    },
    handleSelect: function(e) {
        e.preventDefault();
        this.setState({selectedCharSlot: e.target.value});
    },
    handleConfirm: function(e) {
        e.preventDefault();
        this.props.world.account.loginChar(parseInt(this.state.selectedCharSlot));
    },
    handleCreateChar: function(e) {
        e.preventDefault();
        var name = prompt('input character name: ');
        this.props.world.account.createChar(name);
    },
    render: function() {
        // TODO
        // may be create new component just for show char
        var chars = this.props.world.account.chars;
        var charSelectList = _.map(chars, function(char) {
            var slotIndex = _(char.slotIndex).toString();
            return (
                <option value={slotIndex} key={slotIndex}>
                    { char.name }
                </option>
            );});
        var charInfo = null;
        if (!_.isEmpty(charSelectList)) {
            var char = chars[this.state.selectedCharSlot];
            charInfo = (
                <div>
                    <h1>{ char.name }</h1>
                    <h3>Level: { char.level }</h3>
                    <h3>LastScene: { char.lastSceneName } ({ char.lastX}, { char.lastY })</h3>
                </div>
            );
        }
        return (
            <Grid fluid>
                <Row>
                    <Colm md={1}>
                    </Colm>
                    <Colm md={2}>
                        <form onSubmit={this.handleConfirm}>
                            <Input type="select" onChange={this.handleSelect}
                                   value={this.state.selectedCharSlot} size='10' ref='selectChar' autoFocus>
                            { charSelectList }
                            </Input>
                            <Button bsStyle='primary' bsSize='large' block type='submit'>
                                Confirm
                            </Button>
                        </form>
                        <Button type='submit' bsStyle='success' onClick={this.handleCreateChar}
                                style={{marginTop: '60px'}} bsSize='medium'>
                            Create Character
                        </Button>
                    </Colm>
                    <Colm md={1}>
                    </Colm>
                    <Colm md={8}>
                        { charInfo }
                    </Colm>
                </Row>
            </Grid>
        );
    }
});

module.exports = SelectChar;
