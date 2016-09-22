'use strict';

initialize();

var host = window.document.location.host.replace(/:.*/, '');
var showDates = false;
var searchRegexp = new RegExp('.*');
var webSocket;

function initialize() {
	$(document).ready(function() {
		loadInputs();
	});

	$('#search').keyup(_.debounce(function() {
    	filter($('#search').val());
	}, 300));
}

function loadInputs() {
$.ajax('/api/inputs')
	.done(function(inputNames) {
		var $inputs = $('#inputs');
		_.forEach(inputNames, function(input) {
			var $li = $(document.createElement('li'));
			var $link = $(document.createElement('a'))
				.click(function() {
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
	logContainer().innerHTML = '';
    webSocket = new WebSocket('ws://' + host + ':' + (window.location.port || 80) + '/' + eventSource);
    webSocket.onmessage = function(event) {
      appendToLog(event.data);
    };
    $('#progress-indicator').show();
}

function stopWatching() {
	if(isWatching()) {
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
	scrollToBottom(200 * events.length);
};

function scrollToBottom(scrollTime) {
	if(scrollTime > 1000) {
      scrollTime = 1000;
    }
  
    $("html, body").animate({ scrollTop: $(document).height() }, scrollTime);
} 

function logContainer() {
	return $('#log');
}

function printEvent(event) {
	var $item = $(document.createElement('p')).attr('class', 'log-item');

	if(event.sourceName) {
		$item.append('<span class="label label-default source-name">' + event.sourceName + '</span>');
	}

	var displayProperty = showDates ? 'inline': 'none';
	$item.append('<span class="badge event-date" style="display:' + displayProperty + ';">' + new Date(event.timestamp) + '</span>');
	$item.append('<span class="log">' + event.data + '</span>');
	isVisible($item, searchRegexp);
	return $item;
}

function toggleDates() {
	showDates = !showDates;
	$('.event-date').toggle();
}

function filter(searchText) {
	if(_.trim(searchText) === '') {
		searchRegexp = new RegExp('.*');
		$('.log-item').each(function(index, element) {
			isVisible($(element), searchRegexp);
		});
		return;
	}

	searchRegexp = new RegExp(searchText);
	$('.log-item').each(function(index, element) {
		isVisible($(element), searchRegexp);
	});
}

function isVisible($element, search) {
	var sourceName = _.lowerCase($element.find('.source-name').text());
	var dataText = _.lowerCase($element.find('.log').text());


	if(!(search.test(sourceName) || search.test(dataText))) {
		$element.hide();
	} else {
		$element.show();
	}
}
