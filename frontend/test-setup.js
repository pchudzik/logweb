/* eslint-disable no-var, global-require  */

setupEnzyme();
setupChaiEnzyme();

function setupChaiEnzyme() {
	var chai = require("chai");
	var chaiEnzyme = require("chai-enzyme");
	chai.use(chaiEnzyme());
}

function setupEnzyme() {
	var jsdom = require("jsdom").jsdom;
	var exposedProperties = ["window", "navigator", "document"];

	require("babel-register")();

	global.document = jsdom("");
	global.window = document.defaultView;
	Object.keys(document.defaultView).forEach(property => {
		if (typeof global[property] === "undefined") {
			exposedProperties.push(property);
			global[property] = document.defaultView[property];
		}
	});

	global.navigator = {
		userAgent: "node.js"
	};
}
