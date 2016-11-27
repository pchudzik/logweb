const _ = require("lodash");
const configurationRepository = require("./configurationRepository");

const config = configurationRepository.loadConfiguration();

class ProviderLogConfiguration {
	constructor(logConfig) {
		this.logAppendTimeout = logConfig.logAppendTimeout || error("missing log configuration logAppendTimeout");
		this.newLineRegexp = logConfig.newLineRegexp || error("missing log configuration new line regexp");
	}

	get lineBreakRegexp() {
		return new RegExp(this.newLineRegexp);
	}
}

class ProviderConfiguration {
	constructor(providerConfig) {
		this.name = providerConfig.name || error("missing provider name");
		this.cmd = providerConfig.cmd || error("missing provider cmd");
		this.shell = providerConfig.shell || error("missing provider shell");
		this.log = new ProviderLogConfiguration(providerConfig.log || error("missing provider log configuration"));
	}

	get command() {
		return this.shell.concat(this.cmd);
	}
}

class InputConfiguration {
	constructor(inputConfig) {
		this.name = inputConfig.name || error("missing input name");
		this.buffer = inputConfig.buffer || error("missing input buffer");
		this.providers = (inputConfig.providers || error("missing providers"))
			.map(providerConfig => new ProviderConfiguration(providerConfig));

		if (this.providers.length === 0) {
			error("missing providers");
		}
	}
}

module.exports = {
	getInputs,
	getPort,
	getFlushInterval,
	deleteInput,
	saveInput
};

function getFlushInterval() {
	return config.flushInterval || error("missing flush interval");
}

function getPort() {
	return config.port || error("missing port");
}

function saveInput(input) {
	const inputs = getInputs().concat([input]);
	return configurationRepository.saveConfiguration({
		flushInterval: getFlushInterval(),
		port: getPort(),
		inputs
	});
}

function deleteInput(inputName) {
	return configurationRepository.saveConfiguration({
		flushInterval: getFlushInterval(),
		port: getPort(),
		inputs: getInputs().filter(input => input.name !== inputName)
	});
}

function getInputs() {
	return _.map(config.inputs, singleInput => new InputConfiguration(singleInput));
}

function error(message) {
	throw new Error(message);
}
