/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');
var BS = require('react-bootstrap');
var PageHeader = BS.PageHeader;
var Grid = BS.Grid;
var Panel = BS.Panel;
var Row = BS.Row;
var Colm = BS.Col;

var BrowserDependCheck = React.createClass({
    render: function() {
        var dangerTitle = (
            <h3>Unsupport</h3>
        );
        var successTitle = (
            <h3>Support</h3>
        );
        var urls = {
            indexeddb: "http://en.wikipedia.org/wiki/Indexed_Database_API",
            websockets: "http://en.wikipedia.org/wiki/WebSocket",
            webgl: "http://en.wikipedia.org/wiki/Webgl",
            audio: "http://en.wikipedia.org/wiki/HTML5_Audio",
            draganddrop: "http://www.w3schools.com/html/html5_draganddrop.asp",
            requestanimationframe: "#",
            blobconstructor: "#",
            json: "#"
        };
        var names = {
            indexeddb: "IndexedDB",
            websockets: "WebSocket",
            webgl: "Webgl",
            audio: "Html5 Audio",
            draganddrop: "Html5 drag and drop",
            requestanimationframe: "Web API requestAnimationFrame",
            blobconstructor: "Web API Blob",
            json: "JSON"
        };
        var urlGen = function(name) {
            var url = urls[name];
            if (_.isUndefined(url)) {
                return "#"
            } else {
                return url;
            }
        };
        var ageisNameGen = function(name) {
            var aname = names[name];
            if (_.isUndefined(aname)) {
                return ''
            } else {
                return aname;
            }
        };
        var listGen = function(name) {
            return (
                <a className="list-group-item"
                   href={ urlGen(name) }>
                    { ageisNameGen(name) }
                </a>
            );
        };
        var unsupportResult = _.select(_.keys(this.props.checkResult),
                                       function(c) { return this.props.checkResult[c] == false;},
                                       this);
        var unsupportList = _.map(unsupportResult, listGen);
        var supportResult = _.select(_.keys(this.props.checkResult),
                                     function(c) { return this.props.checkResult[c] == true;},
                                     this);
        var supportList = _.map(supportResult, listGen);
        return (
            <Grid fluid>
                <Row>
                    <PageHeader>
                        <div className='text-center'>
                            Browser Dependencies Check
                        </div>
                    </PageHeader>
                </Row>
                <Row>
                    <Colm md={4}>
                    </Colm>
                    <Colm md={4}>
                        <Panel header={dangerTitle} bsStyle="danger">
                            <div className="list-group">
                                { unsupportList }
                            </div>
                        </Panel>
                    </Colm>
                </Row>
                <Row>
                    <Colm md={4}>
                    </Colm>
                    <Colm md={4}>
                        <Panel header={successTitle} bsStyle="success">
                            <div className="list-group">
                                { supportList }
                            </div>
                        </Panel>
                    </Colm>
                </Row>
            </Grid>
        );
    }
});

module.exports = BrowserDependCheck;
