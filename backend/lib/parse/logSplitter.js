const Subject = require("rxjs").Subject;

module.exports = function LogSplitter(newLineRegexp, logAppendTimeout) {
	const observable = new Subject();
	let dataBuffer = "";
	let pendingFlushTimeout;

	return {
		appendText,
		forceFlush,
		observable
	};

	function appendText(logData) {
		const dataParts = logData.split(newLineRegexp);
		const firstItem = 0;
		const lastItem = dataParts.length - 1;

		for (let i = 0; i < dataParts.length; i++) {
			if (i === firstItem || i === lastItem) {
				handleEdgeItem(dataParts[i]);
			} else {
				handleItem(dataParts[i]);
			}
		}
	}

	function forceFlush() {
		handleItem("");
	}

	function handleEdgeItem(stringMessage) {
		if (stringMessage.search(newLineRegexp) === 0) {
			handleItem("");
		}

		appendToBuffer(stringMessage);
		startFlushTimeout();
	}

	function handleItem(stringMessage) {
		if (dataBuffer.length > 0) {
			clearFlushTimeout(pendingFlushTimeout);
			flushBuffer();
		}
		appendToBuffer(stringMessage);
	}

	function flushBuffer() {
		observable.next(dataBuffer.trim());
		dataBuffer = "";
	}

	function startFlushTimeout() {
		clearFlushTimeout();
		pendingFlushTimeout = setTimeout(forceFlush, logAppendTimeout);
	}

	function clearFlushTimeout() {
		if (pendingFlushTimeout) {
			clearTimeout(pendingFlushTimeout);
		}
	}

	function appendToBuffer(message) {
		dataBuffer += message;
		return dataBuffer;
	}
};

