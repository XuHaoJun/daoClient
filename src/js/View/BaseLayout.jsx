/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Button = BS.Button;
var Navbar = BS.Navbar;
var Nav = BS.Nav;
var NavItem = BS.NavItem;
var DropdownButton = BS.DropdownButton;
var ButtonToolbar = BS.ButtonToolbar;
var MenuItem = BS.MenuItem;

var BaseLayout = module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            navActiveKey: "home",
        };
    },

    notLoginedNavs: function() {
        return (
            <Nav right activeKey={this.props.navActiveKey}>
                <NavItem eventKey="about" href="#about">
                    About
                </NavItem>
                <NavItem eventKey="doc" href="#doc">
                    Document
                </NavItem>
                <NavItem className="divider-vertical"></NavItem>
                <NavItem eventKey="login" href="#login">
                    Login
                </NavItem>
                <NavItem eventKey="register" href="#register">
                    Register
                </NavItem>
            </Nav>
        );
    },

    handleAccountLogout: function(e) {
        e.preventDefault();
        this.props.world.logoutWebAccount();
    },

    loginedNavs: function() {
        var username = this.props.world.lastUsername;
        return (
            <Nav right activeKey={this.props.navActiveKey}>
                <NavItem eventKey="about" href="#about">
                    About
                </NavItem>
                <NavItem eventKey="doc" href="#doc">
                    Document
                </NavItem>
                <NavItem className="divider-vertical"></NavItem>
                <NavItem eventKey="login" href="#login">
                    Login
                </NavItem>
                <DropdownButton title={username} navItem={true} >
                    <MenuItem href="#accountProfile">
                        Profile
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem onClick={this.handleAccountLogout} >
                        Logout
                    </MenuItem>
                </DropdownButton>
            </Nav>
        );
    },

    componentDidMount: function() {
        this.props.world.checkIsWebLogined();
    },

    render: function() {
        var brand = (<a href="#home">Dao</a>);
        var navs = null;
        if (this.props.world.lastUsername != '') {
            navs = this.loginedNavs();
        } else {
            navs = this.notLoginedNavs();
        }
        return (
            <div>
                <Navbar brand={brand}>
                    { navs }
                </Navbar>
                {this.props.children}
            </div>
        );
    }
});
