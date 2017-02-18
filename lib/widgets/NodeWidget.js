"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
/**
 * @author Dylan Vorster
 */
var NodeWidget = (function (_super) {
    __extends(NodeWidget, _super);
    function NodeWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    NodeWidget.prototype.shouldComponentUpdate = function () {
        return this.props.diagramEngine.canEntityRepaint(this.props.node);
    };
    NodeWidget.prototype.render = function () {
        return (React.DOM.div({
            'data-nodeid': this.props.node.id,
            className: 'node' + (this.props.node.isSelected() ? ' selected' : ''),
            style: {
                top: this.props.node.y,
                left: this.props.node.x
            }
        }, React.cloneElement(this.props.children, {})));
    };
    return NodeWidget;
}(React.Component));
exports.NodeWidget = NodeWidget;
