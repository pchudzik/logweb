const express = require("express");
const _ = require("lodash");

const td = require("testdouble");
const proxyquire = require("proxyquire");
const request = require("supertest");

describe("InputsHandler.spec.js", () => {
	const configurationMock = {
		"@noCallThru": true,
		getInputs: td.function()
	};

	let app;

	before(() => {
		const InputsHandler = proxyquire(
			"./InputsHandler",
			{ "../../configuration": configurationMock }
		);
		const inputsHandler = new InputsHandler();
		app = express();
		inputsHandler.setup(app);
	});

	beforeEach(td.reset);

	it("should list all inputs", (done) => {
		// given
		configurationMock.getInputs = _.constant([
			{ name: "first input", otherProperty: "value" },
			{ name: "second input", otherProperty: "value" }
		]);

		// when
		request(app).get("/api/inputs")

		// then
			.expect("Content-Type", /json/)
			.expect(200, [
				{ name: "first input" },
				{ name: "second input" }
			])
			.end(done);
	});
});
