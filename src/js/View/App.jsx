/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Navbar = BS.Navbar;
var Nav = BS.Nav;
var NavItem = BS.NavItem;
var Grid = BS.Grid;

var App = module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            navActiveKey: "home"
        };
    },
    render: function() {
        return (
            <div>
                <Navbar>
                    <Nav activeKey={this.props.navActiveKey}>
                        <NavItem eventKey="home" href="#home">Dao</NavItem>
                        <NavItem eventKey="login" href="#login">LoginGame</NavItem>
                        <NavItem eventKey="doc" href="#doc">Document</NavItem>
                        <NavItem eventKey="about" href="#about">About</NavItem>
                    </Nav>
                </Navbar>
                <Grid fluid>
                    {this.props.children}
                </Grid>
            </div>
        );
    }
});
