/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Button = BS.Button;
var ButtonGroup = BS.ButtonGroup;
var ButtonToolbar = BS.ButtonToolbar;
var DropdownButton = BS.DropdownButton;
var Glyphicon = BS.Glyphicon;
var ProgressBar = BS.ProgressBar;
var MenuItem = BS.MenuItem;
var ModalTrigger = BS.ModalTrigger;
var CharItems = require("./CharItems.js");
var CharSkills = require("./CharSkills.js");
var CharInfo = require("./CharInfo.js");
var CharUsingEquips = require("./CharUsingEquips.js");
var HotKeys = require("./HotKeys.js");
var MiniTargetInfo = require("./MiniTargetInfo.js");
var VideoConfigModal = require("./VideoConfigModal.js");
var SoundConfigModal = require("./SoundConfigModal.js");

// TODO
// add mini target info to it.
var Game2dUI = React.createClass({
    getInitialState: function() {
        return {hotkeyCount: 6,
                showCharItems: false,
                showCharUsingEquips: false,
                showCharInfo: false,
                showCharSkills: false};
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if (!_.isEqual(this.state, nextState)) {
            return true;
        }
        return nextProps.shouldUpdate;
    },
    handleLogout: function() {
        var char = this.props.world.account.usingChar;
        char.logout();
    },
    handleToggleCharInfo: function() {
        this.setState({showCharInfo: !this.state.showCharInfo});
    },
    handleToggleCharItems: function() {
        this.setState({showCharItems: !this.state.showCharItems});
    },
    handleToggleCharSkills: function() {
        this.setState({showCharSkills: !this.state.showCharSkills});
    },
    handleToggleCharUsingEquips: function() {
        this.setState({showCharUsingEquips: !this.state.showCharUsingEquips});
    },
    render: function() {
        var miniTargetInfo = null;
        if (this.props.miniTarget) {
            miniTargetInfo = (<MiniTargetInfo miniTarget={this.props.miniTarget} />);
        }
        var char = this.props.char;
        var hpNow = (char.hp / char.maxHp) * 100;
        var mpNow = (char.mp / char.maxMp) * 100;
        return (
            <div>
                <div className="nav" role="navigation">
                    <div className="navbar-inner" style={{'margin-top': '7px'}}>
                        <Grid fluid>
                            <Row>
                                <Colm md={4} sm={4}>
                                    <HotKeys hotKeys={this.props.char.hotKeys}
                                             world={this.props.world} />
                                </Colm>
                                <Colm md={4} sm={4}>
                                    <div className="center-block noselect">
                                        <ProgressBar bsStyle='danger' now={hpNow}
                                                     label="%(percent)s%" style={{'margin-bottom': '2px'}}/>
                                        <ProgressBar bsStyle='info' now={mpNow}
                                                     label="%(percent)s%"  style={{'margin-bottom': '4px'}}/>
                                        { miniTargetInfo }
                                    </div>
                                </Colm>
                                <Colm md={4} sm={4}>
                                    <ButtonToolbar>
                                        <ButtonGroup>
                                            <Button onClick={this.handleToggleCharItems}
                                                    bsStyle='default' bsSize='medium'>
                                                物品
                                            </Button>
                                            <Button onClick={this.handleToggleCharUsingEquips}
                                                    bsStyle='default' bsSize='medium'>
                                                裝備
                                            </Button>
                                            <Button onClick={this.handleToggleCharInfo}
                                                    bsStyle='default' bsSize='medium'>
                                                人物
                                            </Button>
                                            <Button onClick={this.handleToggleCharSkills}
                                                    bsStyle='default' bsSize='medium'>
                                                技能
                                            </Button>
                                        </ButtonGroup>
                                        <ButtonGroup>
                                            <DropdownButton title={<Glyphicon glyph="align-justify" />}>
                                                <ModalTrigger modal={<VideoConfigModal world={this.props.world} />}>
                                                    <MenuItem key="1">Video</MenuItem>
                                                </ModalTrigger>
                                                <ModalTrigger modal={<SoundConfigModal world={this.props.world} />}>
                                                    <MenuItem key="2">Sound</MenuItem>
                                                </ModalTrigger>
                                                <MenuItem divider />
                                                <MenuItem onClick={this.handleLogout} key="3">
                                                    Logout
                                                </MenuItem>
                                            </DropdownButton>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </Colm>
                            </Row>
                        </Grid>
                    </div>
                </div>
                <CharItems items={this.props.charItems}
                           show={this.state.showCharItems}
                           world={this.props.world}
                           closeButtonClick={this.handleToggleCharItems} />
                <CharUsingEquips usingEquips={this.props.charUsingEquips}
                                 show={this.state.showCharUsingEquips}
                                 world={this.props.world}
                                 closeButtonClick={this.handleToggleCharUsingEquips} />
                <CharInfo show={this.state.showCharInfo}
                          world={this.props.world}
                          char={this.props.char}
                          closeButtonClick={this.handleToggleCharInfo} />
                <CharSkills show={this.state.showCharSkills}
                            world={this.props.world}
                            skillBaseIds={this.props.charSkillBaseIds}
                            closeButtonClick={this.handleToggleCharSkills} />
            </div>
        );
    }
});

module.exports = Game2dUI;
