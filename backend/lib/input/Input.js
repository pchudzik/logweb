const respawn = require("respawn");
const InputEvent = require("./InputEvent");
const Subject = require("rxjs").Subject;

module.exports = function Input(provider) {
	const dataObservable = new Subject();
	const processMonitor = respawn(provider.cmd, {
		sleep: provider.restartTimeout || 100,
	});
	processMonitor.on("stdout", processInput);

	this.data = {
		stdout: dataObservable,
	};

	processMonitor.on("stderr", data => console.log("err", data.toString()));

	this.start = function startProcessMonitor() {
		processMonitor.start();
	};

	this.stop = function stopProcessMonitor() {
		processMonitor.stop();
		dataObservable.complete();
	};

	function processInput(rawInputDataBuffer) {
		const input = rawInputDataBuffer.toString();
		const inputEvent = new InputEvent(provider.name, input);
		dataObservable.next(inputEvent);
	}
};
