import { configure } from '@storybook/react';

function loadStories() {
	require('./test_loader.tsx');
}

configure(loadStories, module);
