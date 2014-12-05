/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var BugsAndKnownIssues = require('./BugsAndKnownIssues.js');

var About = module.exports = React.createClass({
    render: function() {
        return (
            <Grid>
                <BugsAndKnownIssues />
            </Grid>
        );
    }
});
