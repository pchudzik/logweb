const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const configuration = require("./configuration");
const setupHttpHandlers = require("./handlers/setupHttpHandlers");
const setupStaticContentHandlers = require("./handlers/setupStaticContentHandlers");
const setupWebSocketsHandlers = require("./handlers/setupWebsocketHandlers");
const InputService = require("./input/InputService");

const expressApp = express();

expressApp.use(bodyParser.json());

const httpServer = http.createServer(expressApp);
const inputService = new InputService(httpServer);

setupHttpHandlers(expressApp, inputService);
setupStaticContentHandlers(expressApp);
setupWebSocketsHandlers(httpServer);

module.exports = {
	start() {
		httpServer.listen(configuration.getPort());
	}
};
