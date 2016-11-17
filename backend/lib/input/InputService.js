const configuration = require("../configuration");
const inputProcessFactory = require("./inputProcessFactory");
const webscoketFactory = require("./websocket/websocketFactory");

module.exports = function InputService(httpServer) {
	const inputProcesses = configuration.getInputs().map(input => {
		const process = inputProcessFactory(input);
		return {
			input,
			process,
			websocket: null
		};
	});

	this.startAll = function initialize() {
		inputProcesses.forEach(inputProcess => this.startInput(inputProcess.input.name), this);
	};

	this.getInput = function getInput(inputName) {
		const {input} = loadInputByName(inputName);
		return {
			name: input.name,
			providers: input.providers.map(provider => ({name: provider.name}))
		};
	};

	this.getInputs = function getInputs() {
		return inputProcesses
			.map(inputProcess => ({
				name: inputProcess.input.name
			}));
	};

	this.startInput = function startInput(inputName) {
		const inputProcess = loadInputByName(inputName);
		inputProcess.process.start();
		inputProcess.websocket = webscoketFactory(
			{server: httpServer, path: `/api/ws/${inputProcess.input.name}`},
			inputProcess.process);
	};

	this.stopInput = function stopInput(inputName) {
		const inputProcess = loadInputByName(inputName);
		inputProcess.process.stop();
		inputProcess.websocket.close();
	};

	function loadInputByName(inputName) {
		const result = inputProcesses
			.find(inputProcess => inputProcess.input.name === inputName);

		if (!result) {
			throw new Error(`No input with name ${inputName}`);
		}

		return result;
	}
};
