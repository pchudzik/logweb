'use strict';

const fs = require('fs');
const _ = require('lodash');

const config = JSON.parse(fs.readFileSync(process.argv[2] || 'logweb.json', 'utf8'));

module.exports = {
	getInputs: getInputs,
	getPort: getPort
};

function getPort() {
	return config.port || 8008;
}

function getInputs() {
	return _.map(config.inputs, singleInput => {
		return {
			name: singleInput.name,
			bufferSize: parseInt(singleInput.bufferSize) || 100,
			providers: resolveProviders(singleInput)
		};
	});
}

function resolveProviders(singleInput) {
	if (singleInput.cmd) {
		return [{
			cmd: resolveInputCmd(singleInput.cmd)
		}];
	} else {
		const providers = _.flatten([singleInput.providers]);
		return providers.map(provider => {
			return {
				name: provider.name,
				cmd: resolveInputCmd(provider.cmd)
			};
		});
	}
}

function resolveInputCmd(cmd) {
	if (_.isString(cmd)) {
		const defaultShell = config.shell || ['/bin/sh', '-c'];
		return _.flatten([defaultShell, cmd]);
	}
	return cmd;
}