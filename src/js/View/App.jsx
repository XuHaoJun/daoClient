/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Navbar = BS.Navbar;
var Nav = BS.Nav;
var NavItem = BS.NavItem;

var App = module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <Navbar>
          <Nav>
            <NavItem key={1} href="#home">Dao</NavItem>
            <NavItem key={2} href="#login">Login</NavItem>
            <NavItem key={3} href="#doc">Document</NavItem>
            <NavItem key={4} href="#about">About</NavItem>
          </Nav>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
});
