const InputsHandler = require("./http/InputsHandler");

module.exports = function setupHandlers(expressApp, inputService) {
	[new InputsHandler(inputService)]
		.forEach(handler => handler.setup(expressApp));
};
