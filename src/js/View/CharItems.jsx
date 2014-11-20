/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');
var BS = require('react-bootstrap');
var Panel = BS.Panel;
var TabbedArea = BS.TabbedArea;
var TabPane = BS.TabPane;
var Draggable = require('react-draggable');
var Item = require('./Item');
var ItemList = require('./ItemList');

var CharItems = React.createClass({
    getDefaultProps: function() {
        return {
            shouldUpdate: true
        };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if (!nextProps.show && !this.props.show) {
            return false;
        }
        if (this.props.show != nextProps.show ||
            this.props.updateId != nextProps.updateId ||
            !_.isEqual(this.state, nextState) ) {
                return true;
        }
        return nextProps.shouldUpdate;
    },
    render: function() {
        var display = (this.props.show ? 'block' : 'none');
        var style = {position: 'fixed',
                     marginTop: '10%',
                     marginLeft: '10%',
                     display: display};
        var header = (
            <div className="handle-draggable">
                <span className="handle-draggable">
                    物品欄
                </span>
                <button
                type="button"
                className="close pull-right"
                onClick={this.props.closeButtonClick}
                dangerouslySetInnerHTML={{__html: '&times'}}
                />
            </div>
        );
        var useSelfItems = (<ItemList items={this.props.items.useSelfItem}
                                      viewName="CharItems"
                                      step={6} />);
        var equipments = (<ItemList items={this.props.items.equipment}
                                    viewName="CharItems"
                                    step={6} />);
        var etcItems = (<ItemList items={this.props.items.etcItem}
                                  viewName="CharItems"
                                  step={6} /> );
        return (
            <Draggable handle=".handle-draggable,.panel-heading,.panel-title"
                       zIndex={50}>
                <Panel header={header} style={style} className="noselect dao-charItems" >
                    <TabbedArea defaultActiveKey={1} centerBlock>
                        <TabPane eventKey={1} tab="消耗">
                            { useSelfItems }
                        </TabPane>
                        <TabPane eventKey={2} tab="裝備">
                            { equipments }
                        </TabPane>
                        <TabPane eventKey={3} tab="其他">
                            { etcItems }
                        </TabPane>
                    </TabbedArea>
                </Panel>
            </Draggable>
        );
    }
});

module.exports = CharItems;
