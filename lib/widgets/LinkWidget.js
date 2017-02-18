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
var LinkWidget = (function (_super) {
    __extends(LinkWidget, _super);
    function LinkWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    LinkWidget.prototype.shouldComponentUpdate = function () {
        return this.props.diagramEngine.canEntityRepaint(this.props.link);
    };
    LinkWidget.prototype.render = function () {
        return this.props.children;
    };
    return LinkWidget;
}(React.Component));
exports.LinkWidget = LinkWidget;
