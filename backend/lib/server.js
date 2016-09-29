'use strict';

const http = require('http');
const express = require('express');
const configuration = require('./configuration');
const setupHttpHandlers = require('./handlers/setupHttpHandlers');
const setupStaticContentHandlers = require('./handlers/setupStaticContentHandlers');
const setupWebSocketsHandlers = require('./handlers/setupWebsocketHandlers');

const expressApp = express();
const httpServer = http.createServer(expressApp);

setupHttpHandlers(expressApp);
setupStaticContentHandlers(expressApp);
setupWebSocketsHandlers(httpServer);

module.exports = {
	start: function () {
		httpServer.listen(configuration.getPort());
	}
};
