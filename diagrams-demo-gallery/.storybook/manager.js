import { addons } from '@storybook/addons';
import '@storybook/addon-actions/register';

import diagramsTheme from './theme';

addons.setConfig({
	theme: diagramsTheme
});
