import * as React from 'react';

import { EditableLabelModel } from './EditableLabelModel';
import styled from '@emotion/styled';
import { action } from '@storybook/addon-actions';

export interface FlowAliasLabelWidgetProps {
	model: EditableLabelModel;
}

namespace S {
	// NOTE: this CSS rules allows to interact with elements in label
	export const Label = styled.div`
		user-select: none;
		pointer-events: auto;
	`;
}

// now we can render all what we want in the label
export const EditableLabelWidget: React.FunctionComponent<FlowAliasLabelWidgetProps> = (props) => {
	const [str, setStr] = React.useState(props.model.value);

	return (
		<S.Label>
			<input
				value={str}
				onChange={(event) => {
					const newVal = event.target.value;

					// update value both in internal component state
					setStr(newVal);
					// and in model object
					props.model.value = newVal;
				}}
			/>

			<button onClick={() => action('model eventDidFire')('You clicked the button')}>Click me!</button>
		</S.Label>
	);
};
