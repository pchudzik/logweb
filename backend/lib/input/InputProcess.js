const respawn = require("respawn");
const InputEvent = require("./InputEvent");
const logProcessorFactory = require("../process/logProcessorFactory");
const Subject = require("rxjs").Subject;

module.exports = function InputProcess(providerConfiguration) {
	const logProcessor = logProcessorFactory(providerConfiguration);
	const dataObservable = new Subject();
	const processMonitor = respawn(providerConfiguration.cmd, {
		sleep: providerConfiguration.restartTimeout || 100
	});

	logProcessor.observable.subscribe(processInput);

	processMonitor.on("stdout", logProcessor.appendText);

	this.name = providerConfiguration.name;
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

	this.status = function processStatus() {
		return processMonitor.status;
	};

	function processInput(inputLogs) {
		dataObservable.next(inputLogs.map(input => new InputEvent(providerConfiguration.name, input)));
	}
};
