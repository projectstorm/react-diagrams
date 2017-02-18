"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common_1 = require("./Common");
var BaseEntity_1 = require("./BaseEntity");
var DiagramModel_1 = require("./DiagramModel");
var _ = require("lodash");
/**
 *
 */
var DiagramEngine = (function (_super) {
    __extends(DiagramEngine, _super);
    function DiagramEngine() {
        var _this = _super.call(this) || this;
        _this.diagramModel = new DiagramModel_1.DiagramModel();
        _this.nodeFactories = {};
        _this.linkFactories = {};
        _this.canvas = null;
        _this.paintableWidgets = null;
        return _this;
    }
    DiagramEngine.prototype.clearRepaintEntities = function () {
        this.paintableWidgets = null;
    };
    DiagramEngine.prototype.enableRepaintEntities = function (entities) {
        var _this = this;
        this.paintableWidgets = {};
        entities.forEach(function (entity) {
            //if a node is requested to repaint, add all of its links
            if (entity instanceof Common_1.NodeModel) {
                _.forEach(entity.getPorts(), function (port) {
                    _.forEach(port.getLinks(), function (link) {
                        _this.paintableWidgets[link.getID()] = true;
                    });
                });
            }
            if (entity instanceof Common_1.PointModel) {
                _this.paintableWidgets[entity.getLink().getID()] = true;
            }
            _this.paintableWidgets[entity.getID()] = true;
        });
    };
    DiagramEngine.prototype.canEntityRepaint = function (baseModel) {
        //no rules applied, allow repaint
        if (this.paintableWidgets === null) {
            return true;
        }
        return this.paintableWidgets[baseModel.getID()] !== undefined;
    };
    DiagramEngine.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
    };
    DiagramEngine.prototype.setDiagramModel = function (model) {
        this.diagramModel = model;
    };
    DiagramEngine.prototype.getDiagramModel = function () {
        return this.diagramModel;
    };
    DiagramEngine.prototype.getNodeFactories = function () {
        return this.nodeFactories;
    };
    DiagramEngine.prototype.getLinkFactories = function () {
        return this.linkFactories;
    };
    DiagramEngine.prototype.registerNodeFactory = function (factory) {
        this.nodeFactories[factory.getType()] = factory;
        this.itterateListeners(function (listener) {
            listener.nodeFactoriesUpdated();
        });
    };
    DiagramEngine.prototype.registerLinkFactory = function (factory) {
        this.linkFactories[factory.getType()] = factory;
        this.itterateListeners(function (listener) {
            listener.linkFactoriesUpdated();
        });
    };
    DiagramEngine.prototype.getFactoryForNode = function (node) {
        if (this.nodeFactories[node.getType()]) {
            return this.nodeFactories[node.getType()];
        }
        console.log("cannot find widget factory for node of type: [" + node.getType() + "]");
        return null;
    };
    DiagramEngine.prototype.getFactoryForLink = function (link) {
        if (this.linkFactories[link.getType()]) {
            return this.linkFactories[link.getType()];
        }
        console.log("cannot find widget factory for link of type: [" + link.getType() + "]");
        return null;
    };
    DiagramEngine.prototype.generateWidgetForLink = function (link) {
        var linkFactory = this.getFactoryForLink(link);
        if (!linkFactory) {
            throw "Cannot find link factory for link: " + link.getType();
        }
        return linkFactory.generateReactWidget(this, link);
    };
    DiagramEngine.prototype.generateWidgetForNode = function (node) {
        var nodeFactory = this.getFactoryForNode(node);
        if (!nodeFactory) {
            throw "Cannot find widget factory for node: " + node.getType();
        }
        return nodeFactory.generateReactWidget(this, node);
    };
    DiagramEngine.prototype.getRelativeMousePoint = function (event) {
        var point = this.getRelativePoint(event.pageX, event.pageY);
        return {
            x: (point.x / (this.diagramModel.getZoomLevel() / 100.0)) - this.diagramModel.getOffsetX(),
            y: (point.y / (this.diagramModel.getZoomLevel() / 100.0)) - this.diagramModel.getOffsetY()
        };
    };
    DiagramEngine.prototype.getRelativePoint = function (x, y) {
        var canvasRect = this.canvas.getBoundingClientRect();
        return { x: x - canvasRect.left, y: y - canvasRect.top };
    };
    DiagramEngine.prototype.getNodePortElement = function (port) {
        var selector = this.canvas.querySelector('.port[data-name="' + port.getName() + '"][data-nodeid="' + port.getParent().getID() + '"]');
        if (selector === null) {
            throw "Cannot find Node Port element with nodeID: [" + port.getParent().getID() + "] and name: [" + port.getName() + "]";
        }
        return selector;
    };
    DiagramEngine.prototype.getPortCenter = function (port) {
        var sourceElement = this.getNodePortElement(port);
        var sourceRect = sourceElement.getBoundingClientRect();
        var rel = this.getRelativePoint(sourceRect.left, sourceRect.top);
        return {
            x: ((sourceElement.offsetWidth / 2) + rel.x / (this.diagramModel.getZoomLevel() / 100.0)) - this.diagramModel.getOffsetX(),
            y: ((sourceElement.offsetHeight / 2) + rel.y / (this.diagramModel.getZoomLevel() / 100.0)) - this.diagramModel.getOffsetY()
        };
    };
    return DiagramEngine;
}(BaseEntity_1.BaseEnity));
exports.DiagramEngine = DiagramEngine;
