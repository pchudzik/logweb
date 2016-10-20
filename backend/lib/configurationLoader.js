const path = require("path");

const confFileName = process.argv.slice(2)[0] || "logweb.js";
const configFileLocation = path.join(process.cwd(), confFileName);

console.log("Loading configuration from ", configFileLocation);

const configuration = require(configFileLocation);	// eslint-disable-line import/no-dynamic-require

module.exports = configuration;
