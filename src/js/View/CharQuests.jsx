/** @jsx React.DOM */

var _ = require('lodash');
var $ = require('jquery/dist/jquery');
var React = require('react');
var Draggable = require('react-draggable');
var BS = require('react-bootstrap');
var Panel = BS.Panel;
var Table = BS.Table;

var QuestItem = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.currentCount}</td>
                <td>{this.props.targetCount}</td>
            </tr>
        );
    }
});

var QuestItems = React.createClass({
    getDefaultProps: function() {
        return {
            names: {}
        };
    },

    render: function() {
        if (_.isEmpty(this.props.questItems)) {
            return null;
        }
        var questItems = _.map(this.props.questItems, function(qItem) {
            var name = this.props.names[qItem.baseId];
            if (_.isUndefined(name)) {
                name = qItem.baseId;
            }
            return (<QuestItem baseId={qItem.baseId}
                               name={name}
                               currentCount={qItem.currentCount}
                               targetCount={qItem.targetCount} />);
        }.bind(this));
        return (
            <Table striped bordered condensed hover>
                <h5>{this.props.title}</h5>
                <thead>
                    <tr>
                        <th>名稱</th>
                        <th>當前數量</th>
                        <th>目標數量</th>
                    </tr>
                </thead>
                <tbody>
                    { questItems }
                </tbody>
            </Table>
        );
    }
});

var Quest = React.createClass({
    render: function() {
        var asset = this.props.assetsQuests[this.props.baseId];
        var header = this.props.baseId;
        var description = "";
        if (_.isObject(asset)) {
            header = asset.name;
            description = (
                <div>
                    <h4>描述：</h4>
                    <p>{asset.description}</p>
                </div>
            );
        }
        return (
            <Panel header={header}>
                { description }
                <h4>條件：</h4>
                <QuestItems questItems={this.props.targetItems}
                            title="需求物品" />
                <QuestItems questItems={this.props.targetMobs}
                            names={this.props.mobNames}
                            title="擊殺怪物" />
                <h4>獎勵：</h4>
            </Panel>
        );
    }
});

var CharQuests = module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            updateId: 0,
            show: false
        };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (!nextProps.show && !this.props.show ||
            (this.props.updateId == nextProps.updateId &&
             nextProps.show == this.props.show)) {
                 return false;
        }
        return true;
    },

    renderNoQuestsContent: function() {
        return (<div>尚無任何任務。</div>);
    },

    renderQuestsContent: function() {
        var mobNames = this.props.world.assets.mobNames;
        return _.map(this.props.quests, function(q) {
            return (<Quest baseId={q.baseId}
                           assetsQuests={this.props.world.assets.quests}
                           targetItems={q.targetItems}
                           targetMobs={q.targetMobs}
                           mobNames={mobNames} />);
        }.bind(this));
    },

    renderBaseLayout: function(children) {
        var header = (
            <div className="handle-draggable">
                <span className="handle-draggable">
                    任務欄
                </span>
                <button
                type="button"
                className="close pull-right"
                onClick={this.props.closeButtonClick}
                dangerouslySetInnerHTML={{__html: '&times'}}
                />
            </div>
        );
        var display = (this.props.show ? 'block' : 'none');
        var style = {position: 'fixed',
                     marginTop: '15%',
                     marginLeft: '55%',
                     display: display};
        return (
            <Draggable handle=".handle-draggable,.dao-charQuests>.panel-heading,.dao-charQuests>.panel-title"
                       zIndex={50}>
                <Panel header={header} style={style}
                       className="noselect dao-charQuests dao-dragPanel" >
                    { children }
                </Panel>
            </Draggable>
        );
    },

    render: function() {
        var content = null;
        if (this.props.quests === null) {
            content = this.renderNoQuestsContent();
        } else {
            content = this.renderQuestsContent();
        }
        return this.renderBaseLayout(content);
    }
});
