const express = require("express");
const td = require("testdouble");
const request = require("supertest");

const InputsHandler = require("./InputsHandler");

describe("InputsHandler.spec.js", () => {
	const inputServiceMock = {
		getInputs: td.function(),
		loadInput: td.function()
	};

	let app;

	before(() => {
		const inputsHandler = new InputsHandler(inputServiceMock);
		app = express();
		inputsHandler.setup(app);
	});

	beforeEach(td.reset);

	it("should list all inputs", done => {
		// given
		const inputs = [
			{name: "first input", status: "WORKING"},
			{name: "second input", status: "STOPPED"}
		];
		td.when(inputServiceMock.getInputs()).thenReturn(inputs);

		// when
		request(app).get("/api/inputs")

		// then
			.expect("Content-Type", /json/)
			.expect(200, inputs)
			.end(done);
	});

	it("should get input details", done => {
		// given
		const inputName = "input-to-find";
		const inputItem = {
			name: inputName,
			providers: [
				{name: "provider1"},
				{name: "provider2"}
			]
		};
		td.when(inputServiceMock.loadInput(inputName)).thenReturn(inputItem);

		// when
		request(app).get(`/api/inputs/${inputName}`)

		// then
			.expect("Content-Type", /json/)
			.expect(200, inputItem)
			.end(done);
	});

	it("should return 404 status when input not found", done => {
		// given
		const nonExistingInput = "non-existing-input";
		td.when(inputServiceMock.loadInput(nonExistingInput)).thenReturn(null);

		// when
		request(app).get(`/api/inputs/${nonExistingInput}`)

		// then
			.expect("Content-Type", /json/)
			.expect(404, {
				error: `No input with name ${nonExistingInput}`
			})
			.end(done);
	});
});
