import initStoryshots from '@storybook/addon-storyshots';
import 'raf/polyfill';

initStoryshots({ configPath: __dirname+'/../helpers' });
