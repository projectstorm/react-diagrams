"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WidgetFactories_1 = require("../WidgetFactories");
var React = require("react");
var DefaultLinkWidget_1 = require("./DefaultLinkWidget");
/**
 * @author Dylan Vorster
 */
var DefaultLinkFactory = (function (_super) {
    __extends(DefaultLinkFactory, _super);
    function DefaultLinkFactory() {
        return _super.call(this, "default") || this;
    }
    DefaultLinkFactory.prototype.generateReactWidget = function (diagramEngine, link) {
        return React.createElement(DefaultLinkWidget_1.DefaultLinkWidget, {
            link: link,
            diagramEngine: diagramEngine
        });
    };
    return DefaultLinkFactory;
}(WidgetFactories_1.LinkWidgetFactory));
exports.DefaultLinkFactory = DefaultLinkFactory;
