const inputProcessFactory = require("../input/inputProcessFactory");
const configuration = require("../configuration");
const webscoketFactory = require("./websocket/websocketFactory");

module.exports = function setupWebsockets(httpServer) {
	const inputProcesses = configuration.getInputs().map(inputProcessFactory);

	inputProcesses.forEach(inputProcess => webscoketFactory({server: httpServer, path: `/api/ws/${inputProcess.name}`}, inputProcess));
	inputProcesses.forEach(inputProcess => inputProcess.start());
};
