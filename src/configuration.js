'use strict';

import fs from 'fs';
import _ from 'lodash';

const configurationFile = process.argv[2] || 'logweb.json';
const content = fs.readFileSync(configurationFile, 'utf8');
const config = JSON.parse(content);

export {getInputs};

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
