const fs = require("fs");
const _ = require("lodash");

const inputFile = process.argv.slice(2, 3)[0];
const minSleepTime = process.argv.slice(3, 4)[0] || 1000;
const maxSleepTime = process.argv.slice(4, 5)[0] || 1000;

let contentIndex = 0;
const fileContent = fs.readFileSync(inputFile, "utf8");

trigger();

function trigger() {
	const randomSleepTime = _.random(minSleepTime, maxSleepTime);
	setTimeout(printContent, randomSleepTime);
}

function printContent() {
	const bytesToSend = _.random(fileContent.length);
	const content = fileContent.substring(contentIndex, bytesToSend);
	contentIndex += bytesToSend;
	if (contentIndex >= fileContent.length) {
		contentIndex = 0;
	}

	process.stdout.write(content, trigger);
}

