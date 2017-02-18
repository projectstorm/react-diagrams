"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WidgetFactories_1 = require("../WidgetFactories");
var React = require("react");
var DefaultNodeWidget_1 = require("./DefaultNodeWidget");
/**
 * @author Dylan Vorster
 */
var DefaultNodeFactory = (function (_super) {
    __extends(DefaultNodeFactory, _super);
    function DefaultNodeFactory() {
        return _super.call(this, "default") || this;
    }
    DefaultNodeFactory.prototype.generateReactWidget = function (diagramEngine, node) {
        return React.createElement(DefaultNodeWidget_1.DefaultNodeWidget, {
            node: node,
            diagramEngine: diagramEngine,
            color: node.extras['color'],
            name: node.extras['name'],
            inPorts: node.extras['inPorts'],
            outPorts: node.extras['outPorts']
        });
    };
    return DefaultNodeFactory;
}(WidgetFactories_1.NodeWidgetFactory));
exports.DefaultNodeFactory = DefaultNodeFactory;
