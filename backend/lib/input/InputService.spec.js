const proxyquire = require("proxyquire");
const td = require("testdouble");
const expect = require("chai").expect;

describe("inputService.spec.js", () => {
	const configurationMock = {
		"@noCallThru": true,
		getInputs: td.function()
	};

	let inputService;

	beforeEach(() => {
		inputService = createService();
	});


	it("should list all inputs", () => {
		// given
		const otherProperty = "otherProperty";
		td
			.when(configurationMock.getInputs())
			.thenReturn([
				{name: "first", otherProperty},
				{name: "second", otherProperty}
			]);

		// when
		const allInputs = inputService.getInputs();

		// then
		expect(allInputs).to.eql([
			{name: "first", status: "WORKING"},
			{name: "second", status: "WORKING"}
		]);
	});

	it("should find single input by name", () => {
		// given
		const inputToFind = "input to fnid";
		const otherProperty = "otherProperty";
		td
			.when(configurationMock.getInputs())
			.thenReturn([
				{
					name: inputToFind,
					otherProperty,
					providers: [
						{name: "provider1", otherProperty},
						{name: "provider2", otherProperty}
					]
				},
				{name: "second", otherProperty}
			]);

		// when
		const foundInput = inputService.getInput(inputToFind);

		// then
		expect(foundInput).to.eql({
			name: inputToFind,
			status: "WORKING",
			providers: [
				{name: "provider1"},
				{name: "provider2"}
			]
		});
	});

	it("should return null when can not find input by name", () => {
		// given
		td
			.when(configurationMock.getInputs())
			.thenReturn([]);

		// when
		const foundInput = inputService.getInput("non existing input name");

		// then
		expect(foundInput).to.be.null;	// eslint-disable-line no-unused-expressions
	});

	function createService() {
		const InputService = proxyquire(
			"./InputService",
			{"../configuration": configurationMock}
		);
		return new InputService();
	}
});
