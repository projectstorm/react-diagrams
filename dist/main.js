(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "_"], factory);
	else if(typeof exports === 'object')
		exports["storm-react-diagrams"] = factory(require("React"), require("lodash"));
	else
		root["storm-react-diagrams"] = factory(root["React"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseEntity_1 = __webpack_require__(4);
var _ = __webpack_require__(1);
/**
 * @author Dylan Vorster
 */
var BaseModel = (function (_super) {
    __extends(BaseModel, _super);
    function BaseModel() {
        var _this = _super.call(this) || this;
        _this.selected = false;
        return _this;
    }
    BaseModel.prototype.deSerialize = function (ob) {
        _super.prototype.deSerialize.call(this, ob);
        this.selected = ob.selected;
    };
    BaseModel.prototype.serialize = function () {
        return _.merge(_super.prototype.serialize.call(this), {
            _class: this.constructor.name,
            selected: this.selected
        });
    };
    BaseModel.prototype.getID = function () {
        return this.id;
    };
    BaseModel.prototype.isSelected = function () {
        return this.selected;
    };
    BaseModel.prototype.setSelected = function (selected) {
        var _this = this;
        this.selected = selected;
        this.itterateListeners(function (listener) {
            if (listener.selectionChanged) {
                listener.selectionChanged(_this, selected);
            }
        });
    };
    BaseModel.prototype.remove = function () {
        var _this = this;
        this.itterateListeners(function (listener) {
            if (listener.entityRemoved) {
                listener.entityRemoved(_this);
            }
        });
    };
    return BaseModel;
}(BaseEntity_1.BaseEntity));
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
    PointModel.prototype.deSerialize = function (ob) {
        _super.prototype.deSerialize.call(this, ob);
        this.x = ob.x;
        this.y = ob.y;
    };
    PointModel.prototype.serialize = function () {
        return _.merge(_super.prototype.serialize.call(this), {
            x: this.x,
            y: this.y
        });
    };
    PointModel.prototype.remove = function () {
        _super.prototype.remove.call(this);
        //clear references
        if (this.link) {
            this.link.removePoint(this);
        }
    };
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
    LinkModel.prototype.deSerialize = function (ob) {
        var _this = this;
        _super.prototype.deSerialize.call(this, ob);
        this.linkType = ob.type;
        this.points = _.map(ob.points, function (point) {
            var p = new PointModel(_this, { x: point.x, y: point.y });
            p.deSerialize(point);
            return p;
        });
    };
    LinkModel.prototype.serialize = function () {
        return _.merge(_super.prototype.serialize.call(this), {
            type: this.linkType,
            source: this.sourcePort ? this.sourcePort.getParent().id : null,
            sourcePort: this.sourcePort ? this.sourcePort.id : null,
            target: this.targetPort ? this.targetPort.getParent().id : null,
            targetPort: this.targetPort ? this.targetPort.id : null,
            points: _.map(this.points, function (point) {
                return point.serialize();
            }),
            extras: this.extras
        });
    };
    LinkModel.prototype.remove = function () {
        _super.prototype.remove.call(this);
        if (this.sourcePort) {
            this.sourcePort.removeLink(this);
        }
        if (this.targetPort) {
            this.targetPort.removeLink(this);
        }
    };
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
    LinkModel.prototype.getSourcePort = function () {
        return this.sourcePort;
    };
    LinkModel.prototype.getTargetPort = function () {
        return this.targetPort;
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
    LinkModel.prototype.removePoint = function (pointModel) {
        this.points.splice(this.getPointIndex(pointModel), 1);
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
    PortModel.prototype.deSerialize = function (ob) {
        _super.prototype.deSerialize.call(this, ob);
        this.name = ob.name;
    };
    PortModel.prototype.serialize = function () {
        return _.merge(_super.prototype.serialize.call(this), {
            name: this.name,
            parentNode: this.parentNode.id,
            links: _.map(this.links, function (link) {
                return link.id;
            })
        });
    };
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
    function NodeModel(nodeType) {
        if (nodeType === void 0) { nodeType = 'default'; }
        var _this = _super.call(this) || this;
        _this.nodeType = nodeType;
        _this.x = 0;
        _this.y = 0;
        _this.extras = {};
        _this.ports = {};
        return _this;
    }
    NodeModel.prototype.deSerialize = function (ob) {
        _super.prototype.deSerialize.call(this, ob);
        this.nodeType = ob.type;
        this.x = ob.x;
        this.y = ob.y;
        this.extras = ob.extras;
    };
    NodeModel.prototype.serialize = function () {
        return _.merge(_super.prototype.serialize.call(this), {
            type: this.nodeType,
            x: this.x,
            y: this.y,
            extras: this.extras,
            ports: _.map(this.ports, function (port) {
                return port.serialize();
            })
        });
    };
    NodeModel.prototype.remove = function () {
        _super.prototype.remove.call(this);
        for (var i in this.ports) {
            _.forEach(this.ports[i].getLinks(), function (link) {
                link.remove();
            });
        }
    };
    NodeModel.prototype.getPortFromID = function (id) {
        for (var i in this.ports) {
            if (this.ports[i].id === id) {
                return this.ports[i];
            }
        }
        return null;
    };
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author Dylan Vorster
 */
var AbstractInstanceFactory = (function () {
    function AbstractInstanceFactory(className) {
        this.className = className;
    }
    AbstractInstanceFactory.prototype.getName = function () {
        return this.className;
    };
    return AbstractInstanceFactory;
}());
exports.AbstractInstanceFactory = AbstractInstanceFactory;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Toolkit_1 = __webpack_require__(7);
/**
 * @author Dylan Vorster
 */
var BaseListener = (function () {
    function BaseListener() {
    }
    return BaseListener;
}());
exports.BaseListener = BaseListener;
var BaseEntity = (function () {
    function BaseEntity() {
        this.listeners = {};
        this.id = Toolkit_1.Toolkit.UID();
    }
    BaseEntity.prototype.getID = function () {
        return this.id;
    };
    BaseEntity.prototype.clearListeners = function () {
        this.listeners = {};
    };
    BaseEntity.prototype.deSerialize = function (data) {
        this.id = data.id;
    };
    BaseEntity.prototype.serialize = function () {
        return {
            id: this.id,
        };
    };
    BaseEntity.prototype.itterateListeners = function (cb) {
        for (var i in this.listeners) {
            cb(this.listeners[i]);
        }
    };
    BaseEntity.prototype.removeListener = function (listener) {
        if (this.listeners[listener]) {
            delete this.listeners[listener];
            return true;
        }
        return false;
    };
    BaseEntity.prototype.addListener = function (listener) {
        var uid = Toolkit_1.Toolkit.UID();
        this.listeners[uid] = listener;
        return uid;
    };
    return BaseEntity;
}());
exports.BaseEntity = BaseEntity;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NodeWidgetFactory;
}(WidgetFactory));
exports.NodeWidgetFactory = NodeWidgetFactory;
var LinkWidgetFactory = (function (_super) {
    __extends(LinkWidgetFactory, _super);
    function LinkWidgetFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LinkWidgetFactory;
}(WidgetFactory));
exports.LinkWidgetFactory = LinkWidgetFactory;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common_1 = __webpack_require__(2);
var BaseEntity_1 = __webpack_require__(4);
var _ = __webpack_require__(1);
/**
 *
 */
var DiagramModel = (function (_super) {
    __extends(DiagramModel, _super);
    function DiagramModel() {
        var _this = _super.call(this) || this;
        _this.links = {};
        _this.nodes = {};
        _this.offsetX = 0;
        _this.offsetY = 0;
        _this.zoom = 100;
        _this.rendered = false;
        return _this;
    }
    DiagramModel.prototype.deSerializeDiagram = function (object, diagramEngine) {
        var _this = this;
        this.deSerialize(object);
        this.offsetX = object.offsetX;
        this.offsetY = object.offsetY;
        this.zoom = object.zoom;
        //deserialize nodes
        _.forEach(object.nodes, function (node) {
            var nodeOb = diagramEngine.getInstanceFactory(node._class).getInstance();
            nodeOb.deSerialize(node);
            //deserialize ports
            _.forEach(node.ports, function (port) {
                var portOb = diagramEngine.getInstanceFactory(port._class).getInstance();
                portOb.deSerialize(port);
                nodeOb.addPort(portOb);
            });
            _this.addNode(nodeOb);
        });
        _.forEach(object.links, function (link) {
            var linkOb = diagramEngine.getInstanceFactory(link._class).getInstance();
            linkOb.deSerialize(link);
            if (link.target) {
                linkOb.setTargetPort(_this.getNode(link.target).getPortFromID(link.targetPort));
            }
            if (link.source) {
                linkOb.setSourcePort(_this.getNode(link.source).getPortFromID(link.sourcePort));
            }
            _this.addLink(linkOb);
        });
    };
    DiagramModel.prototype.serializeDiagram = function () {
        return _.merge(this.serialize(), {
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            zoom: this.zoom,
            links: _.map(this.links, function (link) {
                return link.serialize();
            }),
            nodes: _.map(this.nodes, function (link) {
                return link.serialize();
            }),
        });
    };
    DiagramModel.prototype.clearSelection = function (ignore) {
        if (ignore === void 0) { ignore = null; }
        _.forEach(this.getSelectedItems(), function (element) {
            if (ignore && ignore.getID() === element.getID()) {
                return;
            }
            element.setSelected(false); //TODO dont fire the listener
        });
    };
    DiagramModel.prototype.getSelectedItems = function () {
        var items = [];
        //find all nodes
        items = items.concat(_.filter(this.nodes, function (node) {
            return node.isSelected();
        }));
        //find all points
        items = items.concat(_.filter(_.flatMap(this.links, function (node) {
            return node.points;
        }), function (port) {
            return port.isSelected();
        }));
        //find all links
        return items.concat(_.filter(this.links, function (link) {
            return link.isSelected();
        }));
    };
    DiagramModel.prototype.setZoomLevel = function (zoom) {
        this.zoom = zoom;
        this.itterateListeners(function (listener) {
            if (listener.controlsUpdated)
                listener.controlsUpdated();
        });
    };
    DiagramModel.prototype.setOffset = function (offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.itterateListeners(function (listener) {
            if (listener.controlsUpdated)
                listener.controlsUpdated();
        });
    };
    DiagramModel.prototype.setOffsetX = function (offsetX) {
        this.offsetX = offsetX;
        this.itterateListeners(function (listener) {
            if (listener.controlsUpdated)
                listener.controlsUpdated();
        });
    };
    DiagramModel.prototype.setOffsetY = function (offsetY) {
        this.offsetX = offsetY;
        this.itterateListeners(function (listener) {
            if (listener.controlsUpdated)
                listener.controlsUpdated();
        });
    };
    DiagramModel.prototype.getOffsetY = function () {
        return this.offsetY;
    };
    DiagramModel.prototype.getOffsetX = function () {
        return this.offsetX;
    };
    DiagramModel.prototype.getZoomLevel = function () {
        return this.zoom;
    };
    DiagramModel.prototype.getNode = function (node) {
        if (node instanceof Common_1.NodeModel) {
            return node;
        }
        if (!this.nodes[node]) {
            return null;
        }
        return this.nodes[node];
    };
    DiagramModel.prototype.getLink = function (link) {
        if (link instanceof Common_1.LinkModel) {
            return link;
        }
        if (!this.links[link]) {
            return null;
        }
        return this.links[link];
    };
    DiagramModel.prototype.addLink = function (link) {
        var _this = this;
        link.addListener({
            entityRemoved: function () {
                _this.removeLink(link);
            }
        });
        this.links[link.getID()] = link;
        this.itterateListeners(function (listener) {
            if (listener.linksUpdated)
                listener.linksUpdated(link, true);
        });
        return link;
    };
    DiagramModel.prototype.addNode = function (node) {
        var _this = this;
        node.addListener({
            entityRemoved: function () {
                _this.removeNode(node);
            }
        });
        this.nodes[node.getID()] = node;
        this.itterateListeners(function (listener) {
            if (listener.nodesUpdated)
                listener.nodesUpdated(node, true);
        });
        return node;
    };
    DiagramModel.prototype.removeLink = function (link) {
        if (link instanceof Common_1.LinkModel) {
            delete this.links[link.getID()];
            this.itterateListeners(function (listener) {
                if (listener.linksUpdated)
                    listener.linksUpdated(link, false);
            });
            return;
        }
        delete this.links['' + link];
        this.itterateListeners(function (listener) {
            if (listener.linksUpdated)
                listener.linksUpdated(link, false);
        });
    };
    DiagramModel.prototype.removeNode = function (node) {
        if (node instanceof Common_1.NodeModel) {
            delete this.nodes[node.getID()];
            this.itterateListeners(function (listener) {
                if (listener.nodesUpdated)
                    listener.nodesUpdated(node, false);
            });
            return;
        }
        delete this.nodes['' + node];
        this.itterateListeners(function (listener) {
            if (listener.nodesUpdated)
                listener.nodesUpdated(node, false);
        });
    };
    DiagramModel.prototype.getLinks = function () {
        return this.links;
    };
    DiagramModel.prototype.getNodes = function () {
        return this.nodes;
    };
    return DiagramModel;
}(BaseEntity_1.BaseEntity));
exports.DiagramModel = DiagramModel;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author Dylan Vorster
 */
var Toolkit = (function () {
    function Toolkit() {
    }
    /**
   * Generats a unique ID (thanks Stack overflow :3)
   * @returns {String}
   */
    Toolkit.UID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return Toolkit;
}());
exports.Toolkit = Toolkit;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var Common_1 = __webpack_require__(2);
var _ = __webpack_require__(1);
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
            r: 5,
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
            },
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
            strokeLinecap: 'round',
            onMouseLeave: function () {
                _this.setState({ selected: false });
            },
            onMouseEnter: function () {
                _this.setState({ selected: true });
            },
            'data-linkid': this.props.link.getID(),
            stroke: this.props.color,
            strokeOpacity: this.state.selected ? 0.1 : 0,
            strokeWidth: 20,
            onContextMenu: function (event) {
                event.preventDefault();
                _this.props.link.remove();
            },
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
                    if (!event.shiftKey) {
                        var point = new Common_1.PointModel(_this.props.link, _this.props.diagramEngine.getRelativeMousePoint(event));
                        point.setSelected(true);
                        _this.forceUpdate();
                        _this.props.link.addPoint(point, 1);
                        _this.props.pointAdded(point, event);
                    }
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
                    'data-linkid': _this.props.link.id,
                    'data-point': index,
                    onMouseDown: function (event) {
                        if (!event.shiftKey) {
                            var point = new Common_1.PointModel(_this.props.link, _this.props.diagramEngine.getRelativeMousePoint(event));
                            point.setSelected(true);
                            _this.forceUpdate();
                            _this.props.link.addPoint(point, index + 1);
                            _this.props.pointAdded(point, event);
                        }
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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var _ = __webpack_require__(1);
var div = React.DOM.div;
var DefaultPortLabelWidget_1 = __webpack_require__(10);
/**
 * @author Dylan Vorster
 */
var DefaultNodeWidget = (function (_super) {
    __extends(DefaultNodeWidget, _super);
    function DefaultNodeWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    DefaultNodeWidget.prototype.render = function () {
        return (div({ className: 'basic-node', style: { background: this.props.node.color } }, div({ className: 'title' }, div({ className: 'name' }, this.props.node.name), div({ className: 'fa fa-close', onClick: this.props.node.remove })), div({ className: 'ports' }, div({ className: 'in' }, _.map(this.props.node.getInPorts(), function (port) {
            return React.createElement(DefaultPortLabelWidget_1.DefaultPortLabel, { model: port, key: port.id });
        })), div({ className: 'out' }, _.map(this.props.node.getOutPorts(), function (port) {
            return React.createElement(DefaultPortLabelWidget_1.DefaultPortLabel, { model: port, key: port.id });
        })))));
    };
    return DefaultNodeWidget;
}(React.Component));
DefaultNodeWidget.defaultProps = {
    node: null,
};
exports.DefaultNodeWidget = DefaultNodeWidget;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var PortWidget_1 = __webpack_require__(15);
/**
 * @author Dylan Vorster
 */
var DefaultPortLabel = (function (_super) {
    __extends(DefaultPortLabel, _super);
    function DefaultPortLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultPortLabel.prototype.render = function () {
        var port = React.createElement(PortWidget_1.PortWidget, { name: this.props.model.name, node: this.props.model.getParent() });
        var label = React.DOM.div({ className: 'name' }, this.props.model.label);
        return React.DOM.div({ className: (this.props.model.in ? 'in' : 'out') + '-port' }, this.props.model.in ? port : label, this.props.model.in ? label : port);
    };
    return DefaultPortLabel;
}(React.Component));
DefaultPortLabel.defaultProps = {
    in: true,
    label: "port"
};
exports.DefaultPortLabel = DefaultPortLabel;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var LinkWidget_1 = __webpack_require__(12);
var _ = __webpack_require__(1);
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
                diagramEngine: _this.props.diagramEngine,
            }, React.cloneElement(generatedLink, { pointAdded: _this.props.pointAdded })));
        })));
    };
    return LinkLayerWidget;
}(React.Component));
exports.LinkLayerWidget = LinkLayerWidget;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
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


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var _ = __webpack_require__(1);
var NodeWidget_1 = __webpack_require__(14);
/**
 * @author Dylan Vorster
 */
var NodeLayerWidget = (function (_super) {
    __extends(NodeLayerWidget, _super);
    function NodeLayerWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    NodeLayerWidget.prototype.render = function () {
        var _this = this;
        var diagramModel = this.props.diagramEngine.getDiagramModel();
        return (React.DOM.div({
            className: 'node-view',
            style: {
                transform: 'scale(' + diagramModel.getZoomLevel() / 100.0 + ') translate(' + diagramModel.getOffsetX() + 'px,' + diagramModel.getOffsetY() + 'px)',
                width: '100%',
                height: '100%'
            }
        }, _.map(diagramModel.getNodes(), function (node) {
            return (React.createElement(NodeWidget_1.NodeWidget, { diagramEngine: _this.props.diagramEngine, key: node.id, node: node }, _this.props.diagramEngine.generateWidgetForNode(node)));
        })));
    };
    return NodeLayerWidget;
}(React.Component));
exports.NodeLayerWidget = NodeLayerWidget;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
/**
 * @author Dylan Vorster
 */
var NodeWidget = (function (_super) {
    __extends(NodeWidget, _super);
    function NodeWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    NodeWidget.prototype.shouldComponentUpdate = function () {
        return this.props.diagramEngine.canEntityRepaint(this.props.node);
    };
    NodeWidget.prototype.render = function () {
        return (React.DOM.div({
            'data-nodeid': this.props.node.id,
            className: 'node' + (this.props.node.isSelected() ? ' selected' : ''),
            style: {
                top: this.props.node.y,
                left: this.props.node.x,
            }
        }, React.cloneElement(this.props.children, {})));
    };
    return NodeWidget;
}(React.Component));
exports.NodeWidget = NodeWidget;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
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


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common_1 = __webpack_require__(2);
var BaseEntity_1 = __webpack_require__(4);
var DiagramModel_1 = __webpack_require__(6);
var _ = __webpack_require__(1);
/**
 * Passed as a parameter to the DiagramWidget
 */
var DiagramEngine = (function (_super) {
    __extends(DiagramEngine, _super);
    function DiagramEngine() {
        var _this = _super.call(this) || this;
        _this.diagramModel = new DiagramModel_1.DiagramModel();
        _this.nodeFactories = {};
        _this.linkFactories = {};
        _this.instanceFactories = {};
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
    DiagramEngine.prototype.getInstanceFactory = function (className) {
        return this.instanceFactories[className];
    };
    DiagramEngine.prototype.registerInstanceFactory = function (factory) {
        this.instanceFactories[factory.getName()] = factory;
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
}(BaseEntity_1.BaseEntity));
exports.DiagramEngine = DiagramEngine;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common_1 = __webpack_require__(2);
var AbstractInstanceFactory_1 = __webpack_require__(3);
/**
 * @author Dylan Vorster
 */
var LinkInstanceFactory = (function (_super) {
    __extends(LinkInstanceFactory, _super);
    function LinkInstanceFactory() {
        return _super.call(this, "LinkModel") || this;
    }
    LinkInstanceFactory.prototype.getInstance = function () {
        return new Common_1.LinkModel();
    };
    return LinkInstanceFactory;
}(AbstractInstanceFactory_1.AbstractInstanceFactory));
exports.LinkInstanceFactory = LinkInstanceFactory;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WidgetFactories_1 = __webpack_require__(5);
var React = __webpack_require__(0);
var DefaultLinkWidget_1 = __webpack_require__(8);
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


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WidgetFactories_1 = __webpack_require__(5);
var React = __webpack_require__(0);
var DefaultNodeWidget_1 = __webpack_require__(9);
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
            diagramEngine: diagramEngine
        });
    };
    return DefaultNodeFactory;
}(WidgetFactories_1.NodeWidgetFactory));
exports.DefaultNodeFactory = DefaultNodeFactory;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common_1 = __webpack_require__(2);
var _ = __webpack_require__(1);
var AbstractInstanceFactory_1 = __webpack_require__(3);
var DefaultNodeInstanceFactory = (function (_super) {
    __extends(DefaultNodeInstanceFactory, _super);
    function DefaultNodeInstanceFactory() {
        return _super.call(this, "DefaultNodeModel") || this;
    }
    DefaultNodeInstanceFactory.prototype.getInstance = function () {
        return new DefaultNodeModel();
    };
    return DefaultNodeInstanceFactory;
}(AbstractInstanceFactory_1.AbstractInstanceFactory));
exports.DefaultNodeInstanceFactory = DefaultNodeInstanceFactory;
/**
 * @author Dylan Vorster
 */
var DefaultNodeModel = (function (_super) {
    __extends(DefaultNodeModel, _super);
    function DefaultNodeModel(name, color) {
        if (name === void 0) { name = 'Untitled'; }
        if (color === void 0) { color = 'rgb(0,192,255)'; }
        var _this = _super.call(this, "default") || this;
        _this.name = name;
        _this.color = color;
        return _this;
    }
    DefaultNodeModel.prototype.deSerialize = function (object) {
        _super.prototype.deSerialize.call(this, object);
        this.name = object.name;
        this.color = object.color;
    };
    DefaultNodeModel.prototype.serialize = function () {
        return _.merge(_super.prototype.serialize.call(this), {
            name: this.name,
            color: this.color,
        });
    };
    DefaultNodeModel.prototype.getInPorts = function () {
        return _.filter(this.ports, function (portModel) {
            return portModel.in;
        });
    };
    DefaultNodeModel.prototype.getOutPorts = function () {
        return _.filter(this.ports, function (portModel) {
            return !portModel.in;
        });
    };
    return DefaultNodeModel;
}(Common_1.NodeModel));
exports.DefaultNodeModel = DefaultNodeModel;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common_1 = __webpack_require__(2);
var _ = __webpack_require__(1);
var AbstractInstanceFactory_1 = __webpack_require__(3);
var DefaultPortInstanceFactory = (function (_super) {
    __extends(DefaultPortInstanceFactory, _super);
    function DefaultPortInstanceFactory() {
        return _super.call(this, "DefaultPortModel") || this;
    }
    DefaultPortInstanceFactory.prototype.getInstance = function () {
        return new DefaultPortModel(true, "unknown");
    };
    return DefaultPortInstanceFactory;
}(AbstractInstanceFactory_1.AbstractInstanceFactory));
exports.DefaultPortInstanceFactory = DefaultPortInstanceFactory;
/**
 * @author Dylan Vorster
 */
var DefaultPortModel = (function (_super) {
    __extends(DefaultPortModel, _super);
    function DefaultPortModel(isInput, name, label) {
        if (label === void 0) { label = null; }
        var _this = _super.call(this, name) || this;
        _this.in = isInput;
        _this.label = label || name;
        return _this;
    }
    DefaultPortModel.prototype.deSerialize = function (object) {
        _super.prototype.deSerialize.call(this, object);
        this.in = object.in;
        this.label = object.label;
    };
    DefaultPortModel.prototype.serialize = function () {
        return _.merge(_super.prototype.serialize.call(this), {
            in: this.in,
            label: this.label,
        });
    };
    return DefaultPortModel;
}(Common_1.PortModel));
exports.DefaultPortModel = DefaultPortModel;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var _ = __webpack_require__(1);
var Common_1 = __webpack_require__(2);
var LinkLayerWidget_1 = __webpack_require__(11);
var NodeLayerWidget_1 = __webpack_require__(13);
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
                initialY: item.y,
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
    DiagramWidget.prototype.componentWillUpdate = function (nextProps) {
        if (this.props.diagramEngine.diagramModel.id !== nextProps.diagramEngine.diagramModel.id) {
            this.setState({ renderedNodes: false });
            nextProps.diagramEngine.diagramModel.rendered = true;
        }
        if (!nextProps.diagramEngine.diagramModel.rendered) {
            this.setState({ renderedNodes: false });
            nextProps.diagramEngine.diagramModel.rendered = true;
        }
    };
    DiagramWidget.prototype.componentDidUpdate = function () {
        if (!this.state.renderedNodes) {
            this.setState({
                renderedNodes: true
            });
        }
    };
    DiagramWidget.prototype.componentDidMount = function () {
        var _this = this;
        this.props.diagramEngine.setCanvas(this.refs['canvas']);
        //add a keyboard listener
        this.setState({
            renderedNodes: true,
            windowListener: window.addEventListener('keydown', function (event) {
                //delete all selected
                if (event.keyCode === 46 || event.keyCode === 8) {
                    _.forEach(_this.props.diagramEngine.getDiagramModel().getSelectedItems(), function (element) {
                        element.remove();
                    });
                    _this.forceUpdate();
                }
            })
        });
        window.focus();
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
                    height: this.state.action.mouseY2 - this.state.action.mouseY,
                }
            }) : null));
    };
    return DiagramWidget;
}(React.Component));
exports.DiagramWidget = DiagramWidget;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @author Dylan Vorster
 */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
//export defaults
__export(__webpack_require__(18));
__export(__webpack_require__(8));
__export(__webpack_require__(19));
__export(__webpack_require__(9));
__export(__webpack_require__(20));
__export(__webpack_require__(21));
__export(__webpack_require__(10));
__export(__webpack_require__(5));
__export(__webpack_require__(7));
__export(__webpack_require__(16));
__export(__webpack_require__(6));
__export(__webpack_require__(4));
__export(__webpack_require__(2));
__export(__webpack_require__(3));
__export(__webpack_require__(17));
__export(__webpack_require__(22));
__export(__webpack_require__(11));
__export(__webpack_require__(12));
__export(__webpack_require__(13));
__export(__webpack_require__(14));
__export(__webpack_require__(15));


/***/ })
/******/ ]);
});
//# sourceMappingURL=main.js.map