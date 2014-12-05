/** @jsx React.DOM */

var React = require('react');

var BugsAndKnownIssues = module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <h3>Bugs</h3>
                <p>1. 地上物品的 Label 與實際大小不符合導致點擊地上時會跑去撿取物品。</p>
            </div>
        );
    }
});
