/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Jumbotron = BS.Jumbotron;

var Home = module.exports = React.createClass({
    render: function() {
        return (
            <Grid>
                <Jumbotron>
                    <h1>Home Page</h1>
                </Jumbotron>
            </Grid>
        );
    }
});
