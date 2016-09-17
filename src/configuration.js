'use strict';

import fs from 'fs';
import _ from 'lodash';

const config = JSON.parse(fs.readFileSync(process.argv[2] || 'logweb.json', 'utf8'));

export default {
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
