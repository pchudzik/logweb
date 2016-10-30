const _ = require("lodash");

const userMessage = process.argv.slice(2, 3)[0] || "";

trigger();

function trigger() {
	setTimeout(print, _.random(500, 1000));
}

function print() {
	const message = `${new Date().toISOString()}: Log message: ${userMessage} ${_.random(1, 1000000)}\n`;
	process.stdout.write(message, trigger);
}
