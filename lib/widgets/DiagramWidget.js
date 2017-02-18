"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var Common_1 = require("../Common");
var LinkLayerWidget_1 = require("./LinkLayerWidget");
var NodeLayerWidget_1 = require("./NodeLayerWidget");
var BaseAction = (function () {
    function BaseAction(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.ms = (new Date()).getTime();
    }
    return BaseAction;
}());
exports.BaseAction = BaseAction;
var SelectingAction = (function (_super) {
    __extends(SelectingAction, _super);
    function SelectingAction(mouseX, mouseY) {
        var _this = _super.call(this, mouseX, mouseY) || this;
        _this.mouseX2 = mouseX;
        _this.mouseY2 = mouseY;
        return _this;
    }
    SelectingAction.prototype.containsElement = function (x, y, diagramModel) {
        var z = diagramModel.getZoomLevel() / 100.0;
        return ((x + diagramModel.getOffsetX()) * z > this.mouseX &&
            (x + diagramModel.getOffsetX()) * z < this.mouseX2 &&
            (y + diagramModel.getOffsetY()) * z > this.mouseY &&
            (y + diagramModel.getOffsetY()) * z < this.mouseY2);
    };
    return SelectingAction;
}(BaseAction));
var MoveCanvasAction = (function (_super) {
    __extends(MoveCanvasAction, _super);
    function MoveCanvasAction(mouseX, mouseY, diagramModel) {
        var _this = _super.call(this, mouseX, mouseY) || this;
        _this.initialOffsetX = diagramModel.getOffsetX();
        _this.initialOffsetY = diagramModel.getOffsetY();
        return _this;
    }
    return MoveCanvasAction;
}(BaseAction));
var MoveItemsAction = (function (_super) {
    __extends(MoveItemsAction, _super);
    function MoveItemsAction(mouseX, mouseY, diagramEngine) {
        var _this = _super.call(this, mouseX, mouseY) || this;
        _this.moved = false;
        diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
        _this.selectionModels = diagramEngine.getDiagramModel().getSelectedItems().map(function (item) {
            return {
                model: item,
                initialX: item.x,
                initialY: item.y
            };
        });
        return _this;
    }
    return MoveItemsAction;
}(BaseAction));
/**
 * @author Dylan Vorster
 */
var DiagramWidget = (function (_super) {
    __extends(DiagramWidget, _super);
    function DiagramWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            action: null,
            renderedNodes: false,
            windowListener: null
        };
        return _this;
    }
    DiagramWidget.prototype.componentWillUnmount = function () {
        this.props.diagramEngine.setCanvas(null);
        window.removeEventListener('keydown', this.state.windowListener);
    };
    DiagramWidget.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.diagramEngine.id !== nextProps.diagramEngine.id) {
            this.setState({ renderedNodes: false });
        }
    };
    /**
     * Gets a model and element under the mouse cursor
     */
    DiagramWidget.prototype.getMouseElement = function (event) {
        var target = event.target;
        var diagramModel = this.props.diagramEngine.diagramModel;
        //is it a port
        var element = target.closest('.port[data-name]');
        if (element) {
            var nodeElement = target.closest('.node[data-nodeid]');
            return {
                model: diagramModel.getNode(nodeElement.getAttribute('data-nodeid')).getPort(element.getAttribute('data-name')),
                element: element
            };
        }
        //look for a point
        element = target.closest('.point[data-id]');
        if (element) {
            return {
                model: diagramModel.getLink(element.getAttribute('data-linkid')).getPointModel(element.getAttribute('data-id')),
                element: element
            };
        }
        //look for a link
        element = target.closest('[data-linkid]');
        if (element) {
            return {
                model: diagramModel.getLink(element.getAttribute('data-linkid')),
                element: element
            };
        }
        //look for a node
        element = target.closest('.node[data-nodeid]');
        if (element) {
            return {
                model: diagramModel.getNode(element.getAttribute('data-nodeid')),
                element: element
            };
        }
        return null;
    };
    DiagramWidget.prototype.componentDidMount = function () {
        var _this = this;
        this.props.diagramEngine.setCanvas(this.refs['canvas']);
        //TODO
        //add a keybaord listener
        this.setState({
            renderedNodes: true,
            windowListener: window.addEventListener('keydown', function (event) {
                //delete all selected
                if (event.keyCode === 46) {
                    _.forEach(_this.props.diagramEngine.getDiagramModel().getSelectedItems(), function (element) {
                        element.remove();
                    });
                }
            })
        });
        window.focus();
    };
    DiagramWidget.prototype.render = function () {
        var _this = this;
        var diagramEngine = this.props.diagramEngine;
        var diagramModel = diagramEngine.getDiagramModel();
        return (React.DOM.div({
            ref: 'canvas',
            className: 'storm-diagrams-canvas',
            onWheel: function (event) {
                event.preventDefault();
                event.stopPropagation();
                diagramModel.setZoomLevel(diagramModel.getZoomLevel() + (event.deltaY / 60));
                diagramEngine.enableRepaintEntities([]);
                _this.forceUpdate();
            },
            onMouseMove: function (event) {
                //select items so draw a bounding box
                if (_this.state.action instanceof SelectingAction) {
                    var relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
                    _.forEach(diagramModel.getNodes(), function (node) {
                        if (_this.state.action.containsElement(node.x, node.y, diagramModel)) {
                            node.setSelected(true);
                        }
                    });
                    _.forEach(diagramModel.getLinks(), function (link) {
                        var allSelected = true;
                        _.forEach(link.points, function (point) {
                            if (_this.state.action.containsElement(point.x, point.y, diagramModel)) {
                                point.setSelected(true);
                            }
                            else {
                                allSelected = false;
                            }
                        });
                        if (allSelected) {
                            link.setSelected(true);
                        }
                    });
                    _this.state.action.mouseX2 = relative.x;
                    _this.state.action.mouseY2 = relative.y;
                    _this.setState({ action: _this.state.action });
                    return;
                }
                else if (_this.state.action instanceof MoveItemsAction) {
                    _.forEach(_this.state.action.selectionModels, function (model) {
                        if (model.model instanceof Common_1.NodeModel || model.model instanceof Common_1.PointModel) {
                            model.model.x = model.initialX + ((event.pageX - _this.state.action.mouseX) / (diagramModel.getZoomLevel() / 100));
                            model.model.y = model.initialY + ((event.pageY - _this.state.action.mouseY) / (diagramModel.getZoomLevel() / 100));
                        }
                    });
                    _this.forceUpdate();
                }
                else if (_this.state.action instanceof MoveCanvasAction) {
                    diagramModel.setOffset(_this.state.action.initialOffsetX + ((event.pageX - _this.state.action.mouseX) / (diagramModel.getZoomLevel() / 100)), _this.state.action.initialOffsetY + ((event.pageY - _this.state.action.mouseY) / (diagramModel.getZoomLevel() / 100)));
                    _this.forceUpdate();
                }
            },
            onMouseDown: function (event) {
                diagramEngine.clearRepaintEntities();
                var model = _this.getMouseElement(event);
                //its the canvas
                if (model === null) {
                    //is it a multiple selection
                    if (event.shiftKey) {
                        var relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
                        _this.setState({
                            action: new SelectingAction(relative.x, relative.y)
                        });
                    }
                    else {
                        var relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
                        diagramModel.clearSelection();
                        _this.setState({
                            action: new MoveCanvasAction(relative.x, relative.y, diagramModel)
                        });
                    }
                }
                else if (model.model instanceof Common_1.PortModel) {
                    var relative = diagramEngine.getRelativeMousePoint(event);
                    var link = new Common_1.LinkModel();
                    link.setSourcePort(model.model);
                    link.getFirstPoint().updateLocation(relative);
                    link.getLastPoint().updateLocation(relative);
                    diagramModel.clearSelection();
                    link.getLastPoint().setSelected(true);
                    diagramModel.addLink(link);
                    _this.setState({
                        action: new MoveItemsAction(event.pageX, event.pageY, diagramEngine)
                    });
                }
                else {
                    if (!event.shiftKey && !model.model.isSelected()) {
                        console.log("clear selection");
                        diagramModel.clearSelection();
                    }
                    model.model.setSelected(true);
                    _this.setState({
                        action: new MoveItemsAction(event.pageX, event.pageY, diagramEngine)
                    });
                }
            },
            onMouseUp: function (event) {
                //are we going to connect a link to something?
                if (_this.state.action instanceof MoveItemsAction) {
                    var element = _this.getMouseElement(event);
                    if (element) {
                        _.forEach(_this.state.action.selectionModels, function (model) {
                            //only care about points connecting to things
                            if (!(model.model instanceof Common_1.PointModel)) {
                                return;
                            }
                            if (element.model instanceof Common_1.PortModel) {
                                model.model.getLink().setTargetPort(element.model);
                            }
                        });
                    }
                }
                diagramEngine.clearRepaintEntities();
                _this.setState({ action: null });
            }
        }, this.state.renderedNodes ?
            React.createElement(LinkLayerWidget_1.LinkLayerWidget, {
                diagramEngine: diagramEngine, pointAdded: function (point, event) {
                    event.stopPropagation();
                    diagramModel.clearSelection(point);
                    _this.setState({
                        action: new MoveItemsAction(event.pageX, event.pageY, diagramEngine)
                    });
                }
            }) : null, React.createElement(NodeLayerWidget_1.NodeLayerWidget, { diagramEngine: diagramEngine }), this.state.action instanceof SelectingAction ?
            React.DOM.div({
                className: 'selector',
                style: {
                    top: this.state.action.mouseY,
                    left: this.state.action.mouseX,
                    width: this.state.action.mouseX2 - this.state.action.mouseX,
                    height: this.state.action.mouseY2 - this.state.action.mouseY
                }
            }) : null));
    };
    return DiagramWidget;
}(React.Component));
exports.DiagramWidget = DiagramWidget;
