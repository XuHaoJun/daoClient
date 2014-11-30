/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var $ = require('jquery/dist/jquery');
var Panel = BS.Panel;
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var ListGroup = BS.ListGroup;
var ListGroupItem = BS.ListGroupItem;
var Nav = BS.Nav;
var NavItem = BS.NavItem;


var Chars = React.createClass({
    render: function() {
        return (
            <div dangerouslySetInnerHTML={
                 {__html: JSON.stringify(this.props.chars, undefined, 4) }
                 } >
            </div>
        );
    }
});

var Profile = React.createClass({
    render: function() {
        return (
            <div>
                <h3>Name</h3>
                <p>{this.props.username}</p>
                <h3>Email</h3>
                <p>{this.props.email}</p>
                <h3>Max Chars</h3>
                <p>{this.props.maxChars}</p>
            </div>
        );
    }
});

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

var Profiles = React.createClass({
    render: function() {
        var subPanelName = capitalize(this.props.navActiveKey);
        var subPanelContent = null;
        if (subPanelName == "Profile") {
            subPanelContent = (<Profile username={this.props.info.username}
                                        email={this.props.info.email}
                                        maxChars={this.props.info.maxChars}
                                        />);

        } else {
            subPanelContent = (<Chars chars={this.props.info.charConfigs} />);
        }
        return (
            <Grid>
                <Row>
                    <Colm md={3}>
                        <Panel header="Profiles">
                            <Nav bsStyle="pills" stacked activeKey={this.props.navActiveKey}>
                                <NavItem eventKey="profile" href="#accountProfile/profile" >
                                    Profile
                                </NavItem>
                                <NavItem eventKey="chars" href="#accountProfile/chars" >
                                    Chars
                                </NavItem>
                            </Nav>
                        </Panel>
                    </Colm>
                    <Colm md={9}>
                        <Panel header={subPanelName}>
                            { subPanelContent }
                        </Panel>
                    </Colm>
                </Row>
            </Grid>
        );
    }
});

var AccountProfile = module.exports = React.createClass({
    getInitialState: function() {
        return {
            info: {}
        };
    },

    componentDidMount: function() {
        this.props.world.getWebAccountInfo(function(data) {
            this.setState({info: data});
        }.bind(this));
    },

    render: function() {
        /* var s = JSON.stringify(this.state.info, undefined, 2); */
        return (
            <Profiles navActiveKey={this.props.navActiveKey}
                      info={this.state.info} />
        );
    }
});
