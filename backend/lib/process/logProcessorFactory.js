const logSplitterFactory = require("./logSplitter");
const logBufferFactory = require("./logBuffer");
const configuration = require("../configuration/configuration");

module.exports = function logProcessorFactory(providerConfiguration) {
	return logBufferFactory(
		configuration.getFlushInterval(),
		logSplitterFactory(
			providerConfiguration.log.lineBreakRegexp,
			providerConfiguration.log.logAppendTimeout)
	);
};
