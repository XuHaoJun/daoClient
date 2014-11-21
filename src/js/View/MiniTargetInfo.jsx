/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var ProgressBar = BS.ProgressBar;

var MiniTargetInfo = React.createClass({
  render: function() {
    if (!_.isObject(this.props.miniTarget)) {
      return null;
    }
    var hp = this.props.miniTarget.hp;
    var maxHp = this.props.miniTarget.maxHp;
    var hpNow = 100;
    if (hp >= 0 && maxHp > 0) {
      hpNow = hp / maxHp * 100;
    }
    return (
      <div className='center-block' style={{backgroundColor: 'gray'}}>
        <ProgressBar bsStyle='success' now={hpNow}
                     label={this.props.miniTarget.name}
                     style={{marginBottom: '0px', marginTop: '0px'}}>
        </ProgressBar>
      </div>
    );
  }
});

module.exports = MiniTargetInfo;
