import * as React from "react";
import * as _ from "lodash";
import { PointModel, NodeModel, LinkModel, PortModel } from "../Common";
import { LinkLayerWidget } from "./LinkLayerWidget";
import { NodeLayerWidget } from "./NodeLayerWidget";
export class BaseAction {
    constructor(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.ms = (new Date()).getTime();
    }
}
class SelectingAction extends BaseAction {
    constructor(mouseX, mouseY) {
        super(mouseX, mouseY);
        this.mouseX2 = mouseX;
        this.mouseY2 = mouseY;
    }
    containsElement(x, y, diagramModel) {
        var z = diagramModel.getZoomLevel() / 100.0;
        return ((x + diagramModel.getOffsetX()) * z > this.mouseX &&
            (x + diagramModel.getOffsetX()) * z < this.mouseX2 &&
            (y + diagramModel.getOffsetY()) * z > this.mouseY &&
            (y + diagramModel.getOffsetY()) * z < this.mouseY2);
    }
}
class MoveCanvasAction extends BaseAction {
    constructor(mouseX, mouseY, diagramModel) {
        super(mouseX, mouseY);
        this.initialOffsetX = diagramModel.getOffsetX();
        this.initialOffsetY = diagramModel.getOffsetY();
    }
}
class MoveItemsAction extends BaseAction {
    constructor(mouseX, mouseY, diagramEngine) {
        super(mouseX, mouseY);
        this.moved = false;
        diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
        this.selectionModels = diagramEngine.getDiagramModel().getSelectedItems().map((item) => {
            return {
                model: item,
                initialX: item.x,
                initialY: item.y,
            };
        });
    }
}
/**
 * @author Dylan Vorster
 */
export class DiagramWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            action: null,
            renderedNodes: false,
            windowListener: null
        };
    }
    componentWillUnmount() {
        this.props.diagramEngine.setCanvas(null);
        window.removeEventListener('keydown', this.state.windowListener);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.diagramEngine.id !== nextProps.diagramEngine.id) {
            this.setState({ renderedNodes: false });
        }
    }
    /**
     * Gets a model and element under the mouse cursor
     */
    getMouseElement(event) {
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
    }
    componentDidMount() {
        this.props.diagramEngine.setCanvas(this.refs['canvas']);
        //TODO
        //add a keybaord listener
        this.setState({
            renderedNodes: true,
            windowListener: window.addEventListener('keydown', (event) => {
                //delete all selected
                if (event.keyCode === 46) {
                    _.forEach(this.props.diagramEngine.getDiagramModel().getSelectedItems(), (element) => {
                        element.remove();
                    });
                    this.forceUpdate();
                }
            })
        });
        window.focus();
    }
    render() {
        var diagramEngine = this.props.diagramEngine;
        var diagramModel = diagramEngine.getDiagramModel();
        return (React.DOM.div({
            ref: 'canvas',
            className: 'storm-diagrams-canvas',
            onWheel: (event) => {
                event.preventDefault();
                event.stopPropagation();
                diagramModel.setZoomLevel(diagramModel.getZoomLevel() + (event.deltaY / 60));
                diagramEngine.enableRepaintEntities([]);
                this.forceUpdate();
            },
            onMouseMove: (event) => {
                //select items so draw a bounding box
                if (this.state.action instanceof SelectingAction) {
                    var relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
                    _.forEach(diagramModel.getNodes(), (node) => {
                        if (this.state.action.containsElement(node.x, node.y, diagramModel)) {
                            node.setSelected(true);
                        }
                    });
                    _.forEach(diagramModel.getLinks(), (link) => {
                        var allSelected = true;
                        _.forEach(link.points, (point) => {
                            if (this.state.action.containsElement(point.x, point.y, diagramModel)) {
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
                    this.state.action.mouseX2 = relative.x;
                    this.state.action.mouseY2 = relative.y;
                    this.setState({ action: this.state.action });
                    return;
                }
                else if (this.state.action instanceof MoveItemsAction) {
                    _.forEach(this.state.action.selectionModels, (model) => {
                        if (model.model instanceof NodeModel || model.model instanceof PointModel) {
                            model.model.x = model.initialX + ((event.pageX - this.state.action.mouseX) / (diagramModel.getZoomLevel() / 100));
                            model.model.y = model.initialY + ((event.pageY - this.state.action.mouseY) / (diagramModel.getZoomLevel() / 100));
                        }
                    });
                    this.forceUpdate();
                }
                else if (this.state.action instanceof MoveCanvasAction) {
                    diagramModel.setOffset(this.state.action.initialOffsetX + ((event.pageX - this.state.action.mouseX) / (diagramModel.getZoomLevel() / 100)), this.state.action.initialOffsetY + ((event.pageY - this.state.action.mouseY) / (diagramModel.getZoomLevel() / 100)));
                    this.forceUpdate();
                }
            },
            onMouseDown: (event) => {
                diagramEngine.clearRepaintEntities();
                var model = this.getMouseElement(event);
                //its the canvas
                if (model === null) {
                    //is it a multiple selection
                    if (event.shiftKey) {
                        var relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
                        this.setState({
                            action: new SelectingAction(relative.x, relative.y)
                        });
                    }
                    else {
                        var relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
                        diagramModel.clearSelection();
                        this.setState({
                            action: new MoveCanvasAction(relative.x, relative.y, diagramModel)
                        });
                    }
                }
                else if (model.model instanceof PortModel) {
                    var relative = diagramEngine.getRelativeMousePoint(event);
                    var link = new LinkModel();
                    link.setSourcePort(model.model);
                    link.getFirstPoint().updateLocation(relative);
                    link.getLastPoint().updateLocation(relative);
                    diagramModel.clearSelection();
                    link.getLastPoint().setSelected(true);
                    diagramModel.addLink(link);
                    this.setState({
                        action: new MoveItemsAction(event.pageX, event.pageY, diagramEngine)
                    });
                }
                else {
                    if (!event.shiftKey && !model.model.isSelected()) {
                        diagramModel.clearSelection();
                    }
                    model.model.setSelected(true);
                    this.setState({
                        action: new MoveItemsAction(event.pageX, event.pageY, diagramEngine)
                    });
                }
            },
            onMouseUp: (event) => {
                //are we going to connect a link to something?
                if (this.state.action instanceof MoveItemsAction) {
                    var element = this.getMouseElement(event);
                    if (element) {
                        _.forEach(this.state.action.selectionModels, (model) => {
                            //only care about points connecting to things
                            if (!(model.model instanceof PointModel)) {
                                return;
                            }
                            if (element.model instanceof PortModel) {
                                model.model.getLink().setTargetPort(element.model);
                            }
                        });
                    }
                }
                diagramEngine.clearRepaintEntities();
                this.setState({ action: null });
            }
        }, this.state.renderedNodes ?
            React.createElement(LinkLayerWidget, {
                diagramEngine: diagramEngine, pointAdded: (point, event) => {
                    event.stopPropagation();
                    diagramModel.clearSelection(point);
                    this.setState({
                        action: new MoveItemsAction(event.pageX, event.pageY, diagramEngine)
                    });
                }
            }) : null, React.createElement(NodeLayerWidget, { diagramEngine: diagramEngine }), this.state.action instanceof SelectingAction ?
            React.DOM.div({
                className: 'selector',
                style: {
                    top: this.state.action.mouseY,
                    left: this.state.action.mouseX,
                    width: this.state.action.mouseX2 - this.state.action.mouseX,
                    height: this.state.action.mouseY2 - this.state.action.mouseY,
                }
            }) : null));
    }
}
