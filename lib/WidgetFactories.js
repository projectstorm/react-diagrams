"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @author Dylan Vorster
 */
var WidgetFactory = (function () {
    function WidgetFactory(name) {
        this.type = name;
    }
    WidgetFactory.prototype.getType = function () {
        return this.type;
    };
    return WidgetFactory;
}());
exports.WidgetFactory = WidgetFactory;
var NodeWidgetFactory = (function (_super) {
    __extends(NodeWidgetFactory, _super);
    function NodeWidgetFactory() {
        return _super.apply(this, arguments) || this;
    }
    return NodeWidgetFactory;
}(WidgetFactory));
exports.NodeWidgetFactory = NodeWidgetFactory;
var LinkWidgetFactory = (function (_super) {
    __extends(LinkWidgetFactory, _super);
    function LinkWidgetFactory() {
        return _super.apply(this, arguments) || this;
    }
    return LinkWidgetFactory;
}(WidgetFactory));
exports.LinkWidgetFactory = LinkWidgetFactory;
