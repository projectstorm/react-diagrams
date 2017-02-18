"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Common_1 = require("../Common");
var _ = require("lodash");
/**
 * @author Dylan Vorster
 */
var DefaultLinkWidget = (function (_super) {
    __extends(DefaultLinkWidget, _super);
    function DefaultLinkWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            selected: false
        };
        return _this;
    }
    DefaultLinkWidget.prototype.generatePoint = function (pointIndex) {
        var _this = this;
        return React.DOM.g({ key: 'point-' + this.props.link.points[pointIndex].id }, React.DOM.circle({
            className: 'point pointui' + (this.props.link.points[pointIndex].isSelected() ? ' selected' : ''),
            cx: this.props.link.points[pointIndex].x,
            cy: this.props.link.points[pointIndex].y,
            r: 5
        }), React.DOM.circle({
            className: 'point',
            'data-linkid': this.props.link.id,
            'data-id': this.props.link.points[pointIndex].id,
            cx: this.props.link.points[pointIndex].x,
            cy: this.props.link.points[pointIndex].y,
            r: 15,
            opacity: 0,
            onMouseLeave: function () {
                _this.setState({ selected: false });
                //				this.props.link.setSelected(false);
            },
            onMouseEnter: function () {
                _this.setState({ selected: true });
                //				this.props.link.setSelected(true);
            }
        }));
    };
    DefaultLinkWidget.prototype.generateLink = function (extraProps) {
        var _this = this;
        var Bottom = React.DOM.path(_.merge({
            className: (this.state.selected || this.props.link.isSelected()) ? 'selected' : '',
            strokeWidth: this.props.width,
            stroke: this.props.color
        }, extraProps));
        var Top = React.DOM.path(_.merge({
            onMouseLeave: function () {
                _this.setState({ selected: false });
                //				this.props.link.setSelected(false);
            },
            onMouseEnter: function () {
                _this.setState({ selected: true });
                //				this.props.link.setSelected(true);
            },
            stroke: this.props.color,
            strokeOpacity: this.state.selected ? 0.1 : 0,
            strokeWidth: 20,
            onContextMenu: function (event) {
                event.preventDefault();
                _this.props.link.remove();
            }
        }, extraProps));
        return React.DOM.g({ key: 'link-' + extraProps.id }, Bottom, Top);
    };
    DefaultLinkWidget.prototype.render = function () {
        var _this = this;
        //ensure id is present for all points on the path
        var points = this.props.link.points;
        var paths = [];
        //draw the smoothing
        if (points.length === 2) {
            //if the points are too close, just draw a straight line
            var margin = 50;
            if (Math.abs(points[0].x - points[1].x) < 50) {
                margin = 5;
            }
            var pointLeft = points[0];
            var pointRight = points[1];
            //some defensive programming to make sure the smoothing is
            //always in the right direction
            if (pointLeft.x > pointRight.x) {
                pointLeft = points[1];
                pointRight = points[0];
            }
            paths.push(this.generateLink({
                id: 0,
                onMouseDown: function (event) {
                    var point = new Common_1.PointModel(_this.props.link, _this.props.diagramEngine.getRelativeMousePoint(event));
                    point.setSelected(true);
                    _this.forceUpdate();
                    _this.props.link.addPoint(point, 1);
                    _this.props.pointAdded(point, event);
                },
                d: " M" + pointLeft.x + " " + pointLeft.y
                    + " C" + (pointLeft.x + margin) + " " + pointLeft.y
                    + " " + (pointRight.x - margin) + " " + pointRight.y
                    + " " + pointRight.x + " " + pointRight.y
            }));
            if (this.props.link.targetPort === null) {
                paths.push(this.generatePoint(1));
            }
        }
        else {
            var ds = [];
            if (this.props.smooth) {
                ds.push(" M" + points[0].x + " " + points[0].y + " C " + (points[0].x + 50) + " " + points[0].y + " " + points[1].x + " " + points[1].y + " " + points[1].x + " " + points[1].y);
                for (var i = 1; i < points.length - 2; i++) {
                    ds.push(" M " + points[i].x + " " + points[i].y + " L " + points[i + 1].x + " " + points[i + 1].y);
                }
                ds.push(" M" + points[i].x + " " + points[i].y + " C " + points[i].x + " " + points[i].y + " " + (points[i + 1].x - 50) + " " + points[i + 1].y + " " + points[i + 1].x + " " + points[i + 1].y);
            }
            else {
                var ds = [];
                for (var i = 0; i < points.length - 1; i++) {
                    ds.push(" M " + points[i].x + " " + points[i].y + " L " + points[i + 1].x + " " + points[i + 1].y);
                }
            }
            paths = ds.map(function (data, index) {
                return _this.generateLink({
                    id: index,
                    'data-link': _this.props.link.id,
                    'data-point': index,
                    onMouseDown: function (event) {
                        var point = new Common_1.PointModel(_this.props.link, _this.props.diagramEngine.getRelativeMousePoint(event));
                        point.setSelected(true);
                        _this.forceUpdate();
                        _this.props.link.addPoint(point, index + 1);
                        _this.props.pointAdded(point, event);
                    },
                    d: data
                });
            });
            //render the circles
            for (var i = 1; i < points.length - 1; i++) {
                paths.push(this.generatePoint(i));
            }
            if (this.props.link.targetPort === null) {
                paths.push(this.generatePoint(points.length - 1));
            }
        }
        return (React.DOM.g(null, paths));
    };
    return DefaultLinkWidget;
}(React.Component));
DefaultLinkWidget.defaultProps = {
    color: 'black',
    width: 3,
    link: null,
    engine: null,
    smooth: false,
    diagramEngine: null
};
exports.DefaultLinkWidget = DefaultLinkWidget;
