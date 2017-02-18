import * as React from "react";
/**
 * @author Dylan Vorster
 */
export class LinkWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    shouldComponentUpdate() {
        return this.props.diagramEngine.canEntityRepaint(this.props.link);
    }
    render() {
        return this.props.children;
    }
}
