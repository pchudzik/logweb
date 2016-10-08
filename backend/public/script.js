'use strict';

initialize();

var host = window.document.location.host.replace(/:.*/, '');
var webSocket;
var follow = true;

function initialize() {
	$(document).ready(function () {
		loadInputs();
	});
}

function loadInputs() {
	$.ajax('/api/inputs')
		.done(function (inputNames) {
			var $inputs = $('#inputs');
			_.forEach(inputNames, function (input) {
				var $li = $(document.createElement('li'));
				var $link = $(document.createElement('a'))
					.click(function () {
						startWatching(input.name);
					})
					.attr('href', '#')
					.text(input.name);
				$li.append($link);
				$inputs.append($li);
			});
		});
}

function startWatching(eventSource) {
	stopWatching();
	logContainer().show();
	logContainer().html('');
	webSocket = new WebSocket('ws://' + host + ':' + (window.location.port || 80) + '/api/ws/' + eventSource);
	webSocket.onmessage = function (event) {
		appendToLog(event.data);
	};
	$('#progress-indicator').show();
}

function stopWatching() {
	if (isWatching()) {
		webSocket.close();
		$('#progress-indicator').hide();
	}
}

function isWatching() {
	return !!webSocket;
}

function appendToLog(eventsJSON) {
	var events = JSON.parse(eventsJSON);
	logContainer().append(printEvent(events));
	if(canFollow()) {
		scrollToBottom(200 * events.length);
	}
}

function scrollToBottom(scrollTime) {
	if (scrollTime > 1000) {
		scrollTime = 1000;
	}

	$("html, body").animate({scrollTop: $(document).height()}, scrollTime);
}

function logContainer() {
	return $('#log').find('pre');
}

function printEvent(event) {
	return safeTagsReplace(event.data);
}

var tagsToReplace = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

function replaceTag(tag) {
	return tagsToReplace[tag] || tag;
}

function safeTagsReplace(str) {
	return str.replace(/[&<>]/g, replaceTag);
}

function canFollow() {
	return follow;
}

function toggleFollowing() {
	follow = !follow;
}
