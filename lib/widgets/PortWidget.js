import * as React from "react";
/**
 * @author Dylan Vorster
 */
export class PortWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }
    render() {
        return (React.DOM.div({
            onMouseEnter: () => {
                this.setState({ selected: true });
            },
            onMouseLeave: () => {
                this.setState({ selected: false });
            },
            className: 'port' + (this.state.selected ? ' selected' : ''),
            'data-name': this.props.name,
            'data-nodeid': this.props.node.getID()
        }));
    }
}
