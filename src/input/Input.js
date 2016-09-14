'use strict';

import respawn from 'respawn';
import InputEvent from './InputEvent';

function Input(provider, dataListener) {
	const processMonitor = respawn(provider.cmd, {
		sleep: provider.restartTimeout || 100
	});
	processMonitor.on('stdout', processInput);
	processMonitor.on('stderr', data => console.log('err', data.toString()));

	this.start = function startProcessMonitor() {
		processMonitor.start();
	};

	this.stop = function stopProcessMonitor() {
		processMonitor.stop();
	};

	function processInput(rawInputDataBuffer) {
		const input = rawInputDataBuffer.toString();
		const inputEvent = new InputEvent(provider.name, input);
		dataListener(inputEvent);
	}
}

export default Input;
