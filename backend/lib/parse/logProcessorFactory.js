const logSplitterFactory = require("./logSplitter");

module.exports = function logProcessorFactory(providerConfiguration) {
	const {newLineRegexp, logAppendTimeout} = providerConfiguration.log;

	return logSplitterFactory(newLineRegexp, logAppendTimeout);
};
