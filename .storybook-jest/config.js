import { configure } from '@storybook/react';

function loadStories() {
	require('../tests/index.tsx');
	// You can require as many demos as you need.
}

configure(loadStories, module);