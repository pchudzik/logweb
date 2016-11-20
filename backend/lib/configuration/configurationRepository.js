const path = require("path");
const fs = require("fs");

module.exports = {
	loadConfiguration,
	saveConfiguration
};

function loadConfiguration() {
	const configFileLocation = resolveConfigurationLocation();
	console.log("Loading configuration from ", configFileLocation);
	return JSON.parse(fs.readFileSync(configFileLocation, "utf8"));
}

function saveConfiguration(configuration) {
	return new Promise((resolve, reject) => {
		const configurationJson = JSON.stringify(configuration, null, 2);
		fs.writeFile(
			resolveConfigurationLocation(),
			configurationJson,
			"utf8",
			err => (err ? reject(err) : resolve(configuration)));
	});
}

function resolveConfigurationLocation() {
	const confFileName = process.argv.slice(2)[0] || "logweb.json";
	return path.join(process.cwd(), confFileName);
}
