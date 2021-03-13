import { Toolkit } from "@projectstorm/react-canvas-core";
Toolkit.TESTING = true;

export default {
	title: 'Advanced Usage'
};

import demo_adv_clone_selected from './demo-cloning';
import demo_adv_ser_des from './demo-serializing';
import demo_adv_prog from './demo-mutate-graph';
import demo_adv_dnd from './demo-drag-and-drop';
import demo_smart_routing from './demo-smart-routing';
import demo_right_angles_routing from './demo-right-angles-routing';
import demo_alternative_linking from './demo-alternative-linking';
import demo_custom_delete_keys from './demo-custom_delete_keys';

export const CloneSelected = demo_adv_clone_selected;
export const SerializingAndDeSerializing = demo_adv_ser_des;
export const ProgramaticallyModifyingGraph = demo_adv_prog;
export const DragAndDrop = demo_adv_dnd;
export const SmartRouting = demo_smart_routing;
export const RightAnglesRouting = demo_right_angles_routing;
export const LinkingByClickingInsteadOfDragging = demo_alternative_linking;
export const SettingCustomDeleteKeys = demo_custom_delete_keys;