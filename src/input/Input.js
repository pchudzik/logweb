'use strict';

import _ from 'lodash';
import respawn from 'respawn';
import InputEvent from './InputEvent';
import {Observable} from 'rxjs';

function Input(provider) {
	const processMonitor = respawn(provider.cmd, {
		sleep: provider.restartTimeout || 100
	});

	const dataObservable = Observable.create(
		observe => processMonitor.on('stdout', _.partial(processInput, observe))
	);

	processMonitor.on('stderr', data => console.log('err', data.toString()));

	this.start = function startProcessMonitor() {
		processMonitor.start();
		return {
			data: dataObservable
		};
	};

	this.stop = function stopProcessMonitor() {
		processMonitor.stop();
	};

	function processInput(observe, rawInputDataBuffer) {
		const input = rawInputDataBuffer.toString();
		const inputEvent = new InputEvent(provider.name, input);
		observe.next(inputEvent);
	}
}

export default Input;
