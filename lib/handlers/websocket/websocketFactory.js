'use strict';

const _ = require('lodash');
const ws = require('ws');

module.exports = function websocketFactory(socketServerOptions, input) {
	return ws.createServer(
		socketServerOptions,
		client => subscribeClientToObservable(client, input));
};

function subscribeClientToObservable(client, input) {
	input.createDataObservable().subscribe(event => sendEventsToClient(client, event));
}

function sendEventsToClient(client, events) {
	const eventsArray = _.flatten([events]);
	eventsArray.forEach(event => sendEvent(client, event));
}

function sendEvent(client, event) {
	client.send(JSON.stringify(event));
}