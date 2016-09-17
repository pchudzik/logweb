'use strict';

import _ from 'lodash';
import configuration from '../../configuration';

export default class InputsHandler {
	setup(expressApp) {
		expressApp.get('/api/inputs', this.listInputs);
	}

	listInputs(req, resp) {
		resp.json(configuration
			.getInputs()
			.map(input => _.pick(input, ['name'])));
	}
}
