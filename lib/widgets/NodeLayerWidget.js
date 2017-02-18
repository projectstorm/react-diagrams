"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var NodeWidget_1 = require("./NodeWidget");
/**
 * @author Dylan Vorster
 */
var NodeLayerWidget = (function (_super) {
    __extends(NodeLayerWidget, _super);
    function NodeLayerWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    NodeLayerWidget.prototype.render = function () {
        var _this = this;
        var diagramModel = this.props.diagramEngine.getDiagramModel();
        return (React.DOM.div({
            className: 'node-view',
            style: {
                transform: 'scale(' + diagramModel.getZoomLevel() / 100.0 + ') translate(' + diagramModel.getOffsetX() + 'px,' + diagramModel.getOffsetY() + 'px)',
                width: '100%',
                height: '100%'
            }
        }, _.map(diagramModel.getNodes(), function (node) {
            return (React.createElement(NodeWidget_1.NodeWidget, { diagramEngine: _this.props.diagramEngine, key: node.id, node: node }, _this.props.diagramEngine.generateWidgetForNode(node)));
        })));
    };
    return NodeLayerWidget;
}(React.Component));
exports.NodeLayerWidget = NodeLayerWidget;
