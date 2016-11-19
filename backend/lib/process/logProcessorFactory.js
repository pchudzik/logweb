const logSplitterFactory = require("./logSplitter");
const logBufferFactory = require("./logBuffer");
const configuration = require("../configuration/configuration");

module.exports = function logProcessorFactory(providerConfiguration) {
	const {newLineRegexp, logAppendTimeout} = providerConfiguration.log;

	return logBufferFactory(
		configuration.getFlushInterval(),
		logSplitterFactory(newLineRegexp, logAppendTimeout)
	);
};
