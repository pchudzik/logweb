'use strict';

const InputsHandler = require('./http/InputsHandler');

module.exports = function setupHandlers(expressApp) {
	[
		new InputsHandler()
	].forEach(handler => handler.setup(expressApp));
};
