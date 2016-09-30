const inputFactory = require("../input/inputFactory");
const configuration = require("../configuration");
const webscoketFactory = require("./websocket/websocketFactory");

module.exports = function setupWebsockets(httpServer) {
	const inputProcesses = configuration.getInputs().map(inputFactory);

	inputProcesses.forEach(inputProcess => webscoketFactory({ server: httpServer, path: `/${inputProcess.name}` }, inputProcess));
	inputProcesses.forEach(inputProcess => inputProcess.start());
};
