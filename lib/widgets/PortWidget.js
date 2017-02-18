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
var PortWidget = (function (_super) {
    __extends(PortWidget, _super);
    function PortWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            selected: false
        };
        return _this;
    }
    PortWidget.prototype.render = function () {
        var _this = this;
        return (React.DOM.div({
            onMouseEnter: function () {
                _this.setState({ selected: true });
            },
            onMouseLeave: function () {
                _this.setState({ selected: false });
            },
            className: 'port' + (this.state.selected ? ' selected' : ''),
            'data-name': this.props.name,
            'data-nodeid': this.props.node.getID()
        }));
    };
    return PortWidget;
}(React.Component));
exports.PortWidget = PortWidget;
