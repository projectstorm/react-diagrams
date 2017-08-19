import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import demo1 from "./demo1/index";

require("./test.scss");

storiesOf('React Diagrams', module)
	.add('Simple Example', () => {
		return demo1();
	});