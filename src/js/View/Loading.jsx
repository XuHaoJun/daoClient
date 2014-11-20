/** @jsx React.DOM */

var React = require('react');
var BS = require('react-bootstrap');
var Grid = BS.Grid;
var Row = BS.Row;
var Colm = BS.Col;
var Well = BS.Well;
var ProgressBar = BS.ProgressBar;

var Loading = React.createClass({
    getInitialState: function() {
        return {progress: 0};
    },
    handleProgress: function(now, max) {
        this.setState({progress: now/max*100});
    },
    render: function() {
        return (
            <Grid fluid style={{marginTop: '20%'}}>
                <Row>
                    <Colm md={3}>
                    </Colm>
                    <Colm md={6}>
                        <Well>
                            <h1 className="center-text center-block">
                                Loading data....
                            </h1>
                            <ProgressBar style={{marginTop: '20px'}}
                                         active bsStyle="success"
                                         now={ this.state.progress } />
                        </Well>
                    </Colm>
                    <Colm md={3}>
                    </Colm>
                </Row>
            </Grid>
        );
    }
});

module.exports = Loading;
