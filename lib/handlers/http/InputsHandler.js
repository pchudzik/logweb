'use strict';

const _ = require('lodash');
const configuration = require('../../configuration');

module.exports = class InputsHandler {
	setup(expressApp) {
		expressApp.get('/api/inputs', this.listInputs);
	}

	listInputs(req, resp) {
		resp.json(configuration
			.getInputs()
			.map(input => _.pick(input, ['name'])));
	}
};
