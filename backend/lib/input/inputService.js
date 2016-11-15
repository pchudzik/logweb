const configuration = require("../configuration");

module.exports = (function inputServiceFactory() {
	return {
		startInput,
		stopInput,
		getInputs,
		getInput
	};

	function getInput(inputName) {
		const inputCollection = configuration
			.getInputs()
			.filter(input => input.name === inputName)
			.map(input => ({
				name: input.name,
				providers: input.providers.map(provider => ({name: provider.name})),
				status: findInputStatus(input)
			}));

		return inputCollection[0] ? inputCollection[0] : null;
	}

	function getInputs() {
		return configuration
			.getInputs()
			.map(input => ({
				name: input.name,
				status: findInputStatus(input)
			}));
	}

	function startInput(inputName) {
		console.log(`Trying to start input ${inputName}`);
		return Promise.resolve("started");
	}

	function stopInput(inputName) {
		console.log(`Trying to stop input ${inputName}`);
		return Promise.resolve("stopped");
	}

	function findInputStatus(/* input */) {
		return "WORKING";
	}
}());
