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
			cmd: resolveInputCmd(singleInput.cmd)
		};
	});
}

function resolveInputCmd(cmd) {
	if (_.isString(cmd)) {
		const defaultShell = config.shell || ['/bin/sh', '-c'];
		return _.flatten([defaultShell, cmd]);
	}
	return cmd;
}
