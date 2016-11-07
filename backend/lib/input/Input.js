const respawn = require("respawn");
const InputEvent = require("./InputEvent");
const logProcessorFactory = require("../process/logProcessorFactory");
const Subject = require("rxjs").Subject;

module.exports = function Input(providerConfiguration) {
	const logProcessor = logProcessorFactory(providerConfiguration);
	const dataObservable = new Subject();
	const processMonitor = respawn(providerConfiguration.cmd, {
		sleep: providerConfiguration.restartTimeout || 100
	});

	logProcessor.observable.subscribe(processInput);

	processMonitor.on("stdout", logProcessor.appendText);

	this.data = {
		stdout: dataObservable
	};

	processMonitor.on("stderr", data => console.log("err", data.toString()));

	this.start = function startProcessMonitor() {
		processMonitor.start();
	};

	this.stop = function stopProcessMonitor() {
		processMonitor.stop();
		dataObservable.complete();
	};

	function processInput(inputLog) {
		const input = inputLog.toString();
		const inputEvent = new InputEvent(providerConfiguration.name, input);
		dataObservable.next(inputEvent);
	}
};
