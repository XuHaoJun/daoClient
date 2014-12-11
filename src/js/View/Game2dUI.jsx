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
var CharParty = require("./CharParty.js");
var CharInfo = require("./CharInfo.js");
var CharUsingEquips = require("./CharUsingEquips.js");
var CharHotKeys = require("./CharHotKeys.js");
var CharHpMpBar = require("./CharHpMpBar.js");
var CharQuests = require("./CharQuests.js");
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
                showCharSkills: false,
                showCharParty: false,
                showCharQuests: false,
                updateCharItems: true,
                updateCharSkills: true,
                updateCharUsingEquips: true,
                updateCharInfo: true
        };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if (this.props.miniTarget != nextProps.miniTarget) {
            nextState.updateCharItems = false;
            nextState.updateCharSkills = false;
            nextState.updateCharUsingEquips = false;
            nextState.updateCharInfo = false;
            return true;
        } else {
            nextState.updateCharItems = true;
            nextState.updateCharSkills = true;
            nextState.updateCharUsingEquips = true;
            nextState.updateCharInfo = true;
        }
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
    handleToggleCharQuests: function() {
        this.setState({showCharQuests: !this.state.showCharQuests});
    },
    handleToggleCharParty: function() {
        this.setState({showCharParty: !this.state.showCharParty});
    },
    handleToggleCharUsingEquips: function() {
        this.setState({showCharUsingEquips: !this.state.showCharUsingEquips});
    },
    render: function() {
        var miniTargetInfo = null;
        if (this.props.miniTarget) {
            miniTargetInfo = (<MiniTargetInfo miniTarget={this.props.miniTarget} />);
        }
        return (
            <div>
                <div className="nav" role="navigation">
                    <div className="navbar-inner" style={{marginTop: '5px'}}>
                        <Grid fluid>
                            <Row>
                                <Colm md={4} sm={4}>
                                    <CharHotKeys hotKeys={this.props.char.hotKeys}
                                                 world={this.props.world} />
                                </Colm>
                                <Colm md={4} sm={4}>
                                    <div className="center-block noselect">
                                        <CharHpMpBar hp={this.props.char.hp}
                                                     maxHp={this.props.char.maxHp}
                                                     mp={this.props.char.mp}
                                                     maxMp={this.props.char.maxMp} />
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
                                            <DropdownButton title={"更多"}>
                                                <MenuItem key="1"
                                                          onClick={this.handleToggleCharQuests} >
                                                    任務
                                                </MenuItem>
                                                <MenuItem key="2"
                                                          onClick={this.handleToggleCharParty}>
                                                    隊伍
                                                </MenuItem>
                                                <MenuItem key="3">
                                                    好友
                                                </MenuItem>
                                            </DropdownButton>
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
                           shouldUpdate={this.state.updateCharItems}
                           updateId={this.props.charItems.updateId}
                           show={this.state.showCharItems}
                           world={this.props.world}
                           closeButtonClick={this.handleToggleCharItems} />
                <CharUsingEquips usingEquips={this.props.charUsingEquips}
                                 shouldUpdate={this.state.updateCharUsingEquips}
                                 updateId={this.props.charUsingEquips.updateId}
                                 show={this.state.showCharUsingEquips}
                                 world={this.props.world}
                                 closeButtonClick={this.handleToggleCharUsingEquips} />
                <CharInfo show={this.state.showCharInfo}
                          shouldUpdate={this.state.updateCharInfo}
                          world={this.props.world}
                          char={this.props.char}
                          updateId={this.props.char.updateId}
                          closeButtonClick={this.handleToggleCharInfo} />
                <CharSkills show={this.state.showCharSkills}
                            shouldUpdate={this.state.updateCharSkills}
                            world={this.props.world}
                            learnedSkills={this.props.charLearnedSkills}
                            closeButtonClick={this.handleToggleCharSkills} />
                <CharParty show={this.state.showCharParty}
                           world={this.props.world}
                           char={this.props.char}
                           party={this.props.charParty}
                           closeButtonClick={this.handleToggleCharParty} />
                <CharQuests show={this.state.showCharQuests}
                            world={this.props.world}
                            char={this.props.char}
                            quests={this.props.charQuests}
                            updateId={this.props.charQuests ? this.props.charQuests.updateId : 0}
                            closeButtonClick={this.handleToggleCharQuests} />
            </div>
        );
    }
});

module.exports = Game2dUI;
