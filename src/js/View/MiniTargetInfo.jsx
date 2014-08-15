/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var ProgressBar = BS.ProgressBar;

var MiniTargetInfo = React.createClass({
  getInitialState: function() {
    return {name: '',
            hpNow: 0
    };
  },
  componentDidMount: function() {
    var name = this.props.target.name;
    var maxHp = this.props.target.maxHp;
    var hp = this.props.target.hp;
    var hpNow = (hp / maxHp) * 100;
    this.setState({name: name, hpNow: hpNow});
  },
  render: function() {
    return (
      <div className='center-block'>
        <h3 className='text-center'>{this.state.name}</h3>
        <ProgressBar bsStyle='success' now={this.state.hpNow}
                     label="%(percent)s%" />
      </div>
    );
  }
});

module.exports = MiniTargetInfo;
