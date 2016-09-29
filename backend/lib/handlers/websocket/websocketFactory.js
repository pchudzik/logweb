'use strict';

const _ = require('lodash');
const ws = require('ws');

module.exports = function websocketFactory(socketServerOptions, input) {
	return ws.createServer(
		socketServerOptions,
		client => subscribeClientToObservable(client, input));
};

function subscribeClientToObservable(client, input) {
	const subscription = input.createDataObservable().subscribe(event => {
		if (client.readyState !== ws.OPEN) {
			return subscription.unsubscribe();
		}

		sendEventsToClient(client, event);
	});
}

function sendEventsToClient(client, events) {
	const eventsArray = _.flatten([events]);
	eventsArray.forEach(event => sendEvent(client, event));
}

function sendEvent(client, event) {
	client.send(JSON.stringify(event), ackError);
}

function ackError(err) {
	if(err) {
		console.log('Can not send event to client', err);
	}
}
