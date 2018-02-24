import { configure } from '@storybook/react';

function loadStories() {
	require('../storybook/test_loader.tsx');
}

configure(loadStories, module);