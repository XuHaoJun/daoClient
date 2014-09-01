/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var ProgressBar = BS.ProgressBar;

var MiniTargetInfo = React.createClass({
  render: function() {
    var hp = this.props.miniTarget.hp;
    var maxHp = this.props.miniTarget.maxHp;
    var hpNow = hp / maxHp * 100;
    return (
      <div className='center-block' style={{'background-color': 'gray'}}>
        <ProgressBar bsStyle='success' now={hpNow}
                     label={this.props.miniTarget.name}
                     style={{'margin-bottom': '0px', 'margin-top': '0px'}}>
        </ProgressBar>
      </div>
    );
  }
});

module.exports = MiniTargetInfo;
