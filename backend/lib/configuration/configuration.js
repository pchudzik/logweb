const _ = require("lodash");
const config = require("./configurationLoader");

module.exports = {
	getInputs,
	getPort,
	getFlushInterval
};

function getFlushInterval() {
	return config.flushInterval || 500;
}

function getPort() {
	return config.port || 8008;
}

function getInputs() {
	return _.map(config.inputs, singleInput => ({
		name: singleInput.name,
		bufferSize: parseInt(singleInput.bufferSize, 10) || 100,
		providers: resolveProviders(singleInput)
	}));
}

function resolveProviders(singleInput) {
	if (singleInput.cmd) {
		return [{
			cmd: resolveInputCmd(singleInput.cmd),
			log: resolveLogCmd()
		}];
	}

	const providers = _.flatten([singleInput.providers]);
	return providers.map(provider => ({
		name: provider.name,
		cmd: resolveInputCmd(provider.cmd),
		log: resolveLogCmd(provider.log)
	}));
}

function resolveLogCmd(maybeLogConfiguration) {
	const logAppendTimeout = 300;
	const newLineRegexp = /\n/;

	if (!maybeLogConfiguration) {
		return {
			logAppendTimeout,
			newLineRegexp
		};
	}

	return {
		logAppendTimeout: maybeLogConfiguration.logAppendTimeout || logAppendTimeout,
		newLineRegexp: maybeLogConfiguration.newLineRegexp || newLineRegexp
	};
}

function resolveInputCmd(cmd) {
	if (_.isString(cmd)) {
		const defaultShell = config.shell || ["/bin/sh", "-c"];
		return _.flatten([defaultShell, cmd]);
	}
	return cmd;
}
