"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Toolkit_1 = require("./Toolkit");
var BaseEntity_1 = require("./BaseEntity");
/**
 * @author Dylan Vorster
 */
var BaseModel = (function (_super) {
    __extends(BaseModel, _super);
    function BaseModel() {
        var _this = _super.call(this) || this;
        _this.id = Toolkit_1.Toolkit.UID();
        _this.selected = false;
        return _this;
    }
    BaseModel.prototype.getID = function () {
        return this.id;
    };
    BaseModel.prototype.isSelected = function () {
        return this.selected;
    };
    BaseModel.prototype.setSelected = function (selected) {
        this.selected = selected;
        this.itterateListeners(function (listener) {
            listener.selectionChanged();
        });
    };
    BaseModel.prototype.remove = function () {
        this.itterateListeners(function (listener) {
            listener.entityRemoved();
        });
    };
    return BaseModel;
}(BaseEntity_1.BaseEnity));
exports.BaseModel = BaseModel;
var PointModel = (function (_super) {
    __extends(PointModel, _super);
    function PointModel(link, points) {
        var _this = _super.call(this) || this;
        _this.x = points.x;
        _this.y = points.y;
        _this.link = link;
        return _this;
    }
    PointModel.prototype.updateLocation = function (points) {
        this.x = points.x;
        this.y = points.y;
    };
    PointModel.prototype.getX = function () {
        return this.x;
    };
    PointModel.prototype.getY = function () {
        return this.y;
    };
    PointModel.prototype.getLink = function () {
        return this.link;
    };
    return PointModel;
}(BaseModel));
exports.PointModel = PointModel;
var LinkModel = (function (_super) {
    __extends(LinkModel, _super);
    function LinkModel() {
        var _this = _super.call(this) || this;
        _this.linkType = 'default';
        _this.points = [
            new PointModel(_this, { x: 0, y: 0 }),
            new PointModel(_this, { x: 0, y: 0 }),
        ];
        _this.extras = {};
        _this.sourcePort = null;
        _this.targetPort = null;
        return _this;
    }
    LinkModel.prototype.isLastPoint = function (point) {
        var index = this.getPointIndex(point);
        return index === this.points.length - 1;
    };
    LinkModel.prototype.getPointIndex = function (point) {
        return this.points.indexOf(point);
    };
    LinkModel.prototype.getPointModel = function (id) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].id === id) {
                return this.points[i];
            }
        }
        return null;
    };
    LinkModel.prototype.getFirstPoint = function () {
        return this.points[0];
    };
    LinkModel.prototype.getLastPoint = function () {
        return this.points[this.points.length - 1];
    };
    LinkModel.prototype.setSourcePort = function (port) {
        port.addLink(this);
        this.sourcePort = port;
    };
    LinkModel.prototype.setTargetPort = function (port) {
        port.addLink(this);
        this.targetPort = port;
    };
    LinkModel.prototype.getPoints = function () {
        return this.points;
    };
    LinkModel.prototype.setPoints = function (points) {
        this.points = points;
    };
    LinkModel.prototype.addPoint = function (pointModel, index) {
        if (index === void 0) { index = 1; }
        this.points.splice(index, 0, pointModel);
    };
    LinkModel.prototype.getType = function () {
        return this.linkType;
    };
    return LinkModel;
}(BaseModel));
exports.LinkModel = LinkModel;
var PortModel = (function (_super) {
    __extends(PortModel, _super);
    function PortModel(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.links = {};
        _this.parentNode = null;
        return _this;
    }
    PortModel.prototype.getName = function () {
        return this.name;
    };
    PortModel.prototype.getParent = function () {
        return this.parentNode;
    };
    PortModel.prototype.setParentNode = function (node) {
        this.parentNode = node;
    };
    PortModel.prototype.removeLink = function (link) {
        delete this.links[link.getID()];
    };
    PortModel.prototype.addLink = function (link) {
        this.links[link.getID()] = link;
    };
    PortModel.prototype.getLinks = function () {
        return this.links;
    };
    return PortModel;
}(BaseModel));
exports.PortModel = PortModel;
var NodeModel = (function (_super) {
    __extends(NodeModel, _super);
    function NodeModel() {
        var _this = _super.call(this) || this;
        _this.canDelete = true;
        _this.nodeType = "default";
        _this.x = 0;
        _this.y = 0;
        _this.extras = {};
        _this.ports = {};
        return _this;
    }
    NodeModel.prototype.getPort = function (name) {
        return this.ports[name];
    };
    NodeModel.prototype.getPorts = function () {
        return this.ports;
    };
    NodeModel.prototype.removePort = function (port) {
        //clear the parent node reference
        if (this.ports[port.name]) {
            this.ports[port.name].setParentNode(null);
            delete this.ports[port.name];
        }
    };
    NodeModel.prototype.addPort = function (port) {
        port.setParentNode(this);
        this.ports[port.name] = port;
        return port;
    };
    NodeModel.prototype.getType = function () {
        return this.nodeType;
    };
    return NodeModel;
}(BaseModel));
exports.NodeModel = NodeModel;
