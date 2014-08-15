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

// TODO
// add mini target info to it.
var Game2dUI = React.createClass({
  getInitialState: function() {
    return {hotkeyCount: 6,
            showMiniTargetInfo: false,
            hpNow: 0, mpNow: 0};
  },
  handleLogout: function() {
    var char = this.props.world.account.usingChar;
    char.logout();
  },
  handleCharBars: function() {
    var char = this.props.world.account.usingChar;
    if (_.isObject(char)) {
      var hpNow = (char.hp / char.maxhp) * 100;
      var mpNow = (char.mp / char.maxMp) * 100;
      this.setState({hpNow: hpNow, mpNow: mpNow});
    }
  },
  handleShowMiniTargetInfo: function() {
  },
  handleHideMiniTargetInfo: function() {
  },
  render: function() {
    var hotkeys = _.map(_.range(this.state.hotkeyCount), function(i) {
      var defaultKeyStyle = {
        width: '40px', height: '40px', 'background-color': '#EEE'
      };
      return (
        <Colm md={2}  key={i}>
          <div className="center-block" style={defaultKeyStyle}>
          </div>
        </Colm>
      );});
    return (
      <div className="nav" role="navigation">
        <div className="navbar-inner" style={{'margin-top': '7px'}}>
          <Grid fluid>
            <Row>
              <Colm md={4} sm={4}>
                <Row className='gutter-2px'>
                  { hotkeys }
                </Row>
              </Colm>
              <Colm md={4} sm={4}>
                <div className="center-block">
                  <ProgressBar bsStyle='success' now={this.state.hpNow}
                               label="%(percent)s%" style={{'margin-bottom': '5px'}}/>
                  <ProgressBar bsStyle='info' now={this.state.mpNow}
                               label="%(percent)s%" />
                </div>
              </Colm>
              <Colm md={4} sm={4}>
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button bsStyle='default' bsSize='medium'>物品</Button>
                    <Button bsStyle='default' bsSize='medium'>裝備</Button>
                    <Button bsStyle='default' bsSize='medium'>人物</Button>
                    <Button bsStyle='default' bsSize='medium'>技能</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <DropdownButton title={<Glyphicon glyph="align-justify" />}>
                      <MenuItem key="1">Video</MenuItem>
                      <MenuItem key="2">Sound</MenuItem>
                      <MenuItem divider />
                      <MenuItem onSelect={this.handleLogout} key="3">
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
    );
  }
});

module.exports = Game2dUI;
