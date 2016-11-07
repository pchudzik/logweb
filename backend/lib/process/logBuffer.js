module.exports = function logBufferFactory(flushInterval, logProcessor) {
	return {
		appendText: data => logProcessor.appendText(data),
		observable: logProcessor.observable
			.bufferTime(flushInterval)
			.filter(array => array.length > 0)
	};
};
