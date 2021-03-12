import demo_simple from "./demo-simple";
import demo_flow from "./demo-simple-flow";
import demo_performance from "./demo-performance";
import demo_locks from "./demo-locks";
import demo_grid from "./demo-grid";
import demo_listeners from "./demo-listeners";
import demo_zoom from "./demo-zoom-to-fit";
import demo_zoom_nodes from "./demo-zoom-to-fit-nodes";
import demo_canvas_drag from "./demo-canvas-drag";
import demo_dynamic_ports from "./demo-dynamic-ports";
import demo_labels from "./demo-labelled-links";

export default {
	title: 'Simple Usage'
};

export const DemoSimple = demo_simple;
export const SimpleFlowExample = demo_flow;
export const PerformanceDemo = demo_performance
export const LockedWidget = demo_locks;
export const CanvasGridSize = demo_grid;
export const EventsAndListeners = demo_listeners;
export const ZoomToFit = demo_zoom;
export const ZoomToFitNodes = demo_zoom_nodes;
export const CanvasDrag = demo_canvas_drag;
export const DynamicPorts = demo_dynamic_ports;
export const LinksWithLabels = demo_labels