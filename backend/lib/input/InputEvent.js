'use strict';

const _ = require('lodash');

module.exports = class InputEvent {
	constructor(providerName, inputString) {
		this.timestamp = _.now();
		this.providerName = providerName;
		this.data = inputString;
	}
};
