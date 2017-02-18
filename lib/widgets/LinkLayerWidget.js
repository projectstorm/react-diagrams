"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var LinkWidget_1 = require("./LinkWidget");
var _ = require("lodash");
/**
 * @author Dylan Vorster
 */
var LinkLayerWidget = (function (_super) {
    __extends(LinkLayerWidget, _super);
    function LinkLayerWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    LinkLayerWidget.prototype.componentDidMount = function () {
        var _this = this;
        setTimeout(function () {
            _this.forceUpdate();
        }, 10);
    };
    LinkLayerWidget.prototype.render = function () {
        var _this = this;
        var diagramModel = this.props.diagramEngine.getDiagramModel();
        return (React.DOM.svg({
            style: {
                transform: 'scale(' + diagramModel.getZoomLevel() / 100.0 + ') translate(' + diagramModel.getOffsetX() + 'px,' + diagramModel.getOffsetY() + 'px)',
                width: '100%',
                height: '100%'
            }
        }, _.map(diagramModel.getLinks(), function (link) {
            //TODO just improve this vastly x_x
            if (link.sourcePort !== null) {
                try {
                    //generate a point
                    link.points[0].updateLocation(_this.props.diagramEngine.getPortCenter(link.sourcePort));
                }
                //remove the link because its problematic (TODO implement this rather at an engine level)
                catch (ex) {
                    console.log(ex);
                    diagramModel.removeLink(link);
                    return;
                }
            }
            if (link.targetPort !== null) {
                try {
                    _.last(link.points).updateLocation(_this.props.diagramEngine.getPortCenter(link.targetPort));
                }
                //remove the link because its problematic (TODO implement this rather at an engine level)
                catch (ex) {
                    console.log(ex);
                    diagramModel.removeLink(link);
                    return;
                }
            }
            //generate links
            var generatedLink = _this.props.diagramEngine.generateWidgetForLink(link);
            if (!generatedLink) {
                console.log("no link generated for type: " + link.getType());
                return null;
            }
            return (React.createElement(LinkWidget_1.LinkWidget, {
                key: link.getID(),
                link: link,
                diagramEngine: _this.props.diagramEngine
            }, React.cloneElement(generatedLink, { pointAdded: _this.props.pointAdded })));
        })));
    };
    return LinkLayerWidget;
}(React.Component));
exports.LinkLayerWidget = LinkLayerWidget;
