import * as React from "react";
/**
 * @author Dylan Vorster
 */
export class NodeWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    shouldComponentUpdate() {
        return this.props.diagramEngine.canEntityRepaint(this.props.node);
    }
    render() {
        return (React.DOM.div({
            'data-nodeid': this.props.node.id,
            className: 'node' + (this.props.node.isSelected() ? ' selected' : ''),
            style: {
                top: this.props.node.y,
                left: this.props.node.x,
            }
        }, React.cloneElement(this.props.children, {})));
    }
}
