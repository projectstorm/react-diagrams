"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var PortWidget_1 = require("../widgets/PortWidget");
/**
 * @author Dylan Vorster
 */
var DefaultNodeWidget = (function (_super) {
    __extends(DefaultNodeWidget, _super);
    function DefaultNodeWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    DefaultNodeWidget.prototype.render = function () {
        var _this = this;
        return (React.DOM.div({ className: 'basic-node', style: { background: this.props.color } }, React.DOM.div({ className: 'title' }, React.DOM.div({ className: 'name' }, this.props.name), React.DOM.div({ className: 'fa fa-close', onClick: this.props.node.remove })), React.DOM.div({ className: 'ports' }, React.DOM.div({ className: 'in' }, this.props.inPorts.map(function (port) {
            var portName = "";
            var displayName = "";
            if (typeof port === 'object') {
                portName = port.name;
                displayName = port.display;
            }
            else {
                portName = port;
                displayName = port;
            }
            return React.DOM.div({ className: 'in-port', key: portName }, React.createElement(PortWidget_1.PortWidget, { name: portName, node: _this.props.node }), React.DOM.div({ className: 'name' }, displayName));
        })), React.DOM.div({ className: 'out' }, this.props.outPorts.map(function (port) {
            var portName = "";
            var displayName = "";
            if (typeof port === 'object') {
                portName = port.name;
                displayName = port.display;
            }
            else {
                portName = port;
                displayName = port;
            }
            return React.DOM.div({ className: 'out-port', key: portName }, React.DOM.div({ className: 'name' }, displayName), React.createElement(PortWidget_1.PortWidget, { name: portName, node: _this.props.node }));
        })))));
    };
    return DefaultNodeWidget;
}(React.Component));
DefaultNodeWidget.defaultProps = {
    name: "Node",
    node: null,
    inPorts: [],
    outPorts: [],
    color: 'rgb(50,50,50)'
};
exports.DefaultNodeWidget = DefaultNodeWidget;
