import * as React from 'react';

import { BodyWidget } from './components/BodyWidget';
import { Application } from './Application';

export default () => {
	var app = new Application();
	return <BodyWidget app={app} />;
};
