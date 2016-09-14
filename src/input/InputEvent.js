'use strict';

import _ from 'lodash';

export default class InputEvent {
	constructor(providerName, inputString) {
		this.timestamp = _.now();
		this.providerName = providerName;
		this.data = inputString;
	}
}
