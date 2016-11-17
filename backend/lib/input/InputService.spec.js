const proxyquire = require("proxyquire");
const td = require("testdouble");
const expect = require("chai").expect;

describe("InputService.spec.js", () => {
	const configurationMock = {
		"@noCallThru": true,
		getInputs: td.function()
	};

	const httpServerMock = "httpServer";
	let websocketFactoryMock;
	let inputProcessFactoryMock;

	beforeEach(() => {
		inputProcessFactoryMock = td.function();
		websocketFactoryMock = td.function();

		inputProcessFactoryMock["@noCallThru"] = true;
		websocketFactoryMock["@noCallThru"] = true;
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
		const allInputs = createService().getInputs();

		// then
		expect(allInputs).to.eql([
			{name: "first"},
			{name: "second"}
		]);
	});

	it("should find single input by name", () => {
		// given
		const inputToFind = "input to find";
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
		const foundInput = createService().getInput(inputToFind);

		// then
		expect(foundInput).to.eql({
			name: inputToFind,
			providers: [
				{name: "provider1"},
				{name: "provider2"}
			]
		});
	});

	it("should throw error when can not find input by name", () => {
		// given
		td
			.when(configurationMock.getInputs())
			.thenReturn([]);

		// expect
		expect(() => createService().getInput("non existing input")).to.throw(Error);
	});

	describe("input start/stop", () => {
		let aInput;
		let bInput;
		let aProcess;
		let bProcess;

		beforeEach(() => {
			aInput = mockInput("a");
			bInput = mockInput("b");
			aProcess = mockProcess();
			bProcess = mockProcess();
			td.when(inputProcessFactoryMock(aInput)).thenReturn(aProcess);
			td.when(inputProcessFactoryMock(bInput)).thenReturn(bProcess);
			td.when(configurationMock.getInputs()).thenReturn([aInput, bInput]);
			td.when(websocketFactoryMock(), {ignoreExtraArgs: true}).thenReturn({
				close: () => {
				}
			});
		});

		describe("start process spec", () => {
			it("should start all inputs", () => {
				// when
				createService().startAll();

				// then
				td.verify(aProcess.start());
				td.verify(bProcess.start());
			});

			it("should start input by name", () => {
				// when
				createService().startInput(bInput.name);

				// then
				td.verify(aProcess.start(), {times: 0});
				td.verify(bProcess.start());
			});

			it("should stop input by name", () => {
				// given
				const service = createService();
				service.startInput(bInput.name);

				// when
				service.stopInput(bInput.name);

				// then
				td.verify(aProcess.stop(), {times: 0});
				td.verify(bProcess.stop());
			});
		});

		describe("weboskcet spec", () => {
			it("should create new websocket on all inputs start", () => {
				// when
				createService().startAll();

				// then
				td.verify(websocketFactoryMock(
					{server: httpServerMock, path: "/api/ws/a"},
					aProcess
				));
				td.verify(websocketFactoryMock(
					{server: httpServerMock, path: "/api/ws/b"},
					bProcess
				));
			});

			it("should create new websocket on input start", () => {
				// when
				createService().startInput(bInput.name);

				// then
				td.verify(websocketFactoryMock(
					{server: httpServerMock, path: "/api/ws/b"},
					bProcess),
					{times: 1});
			});

			it("should stop websocket on input stop", () => {
				// given
				const closeWS = td.function();
				const service = createService();
				td
					.when(websocketFactoryMock(), {ignoreExtraArgs: true})
					.thenReturn({close: closeWS});
				service.startInput(bInput.name);

				// when
				service.stopInput(bInput.name);

				// then
				td.verify(closeWS());
			});
		});

		["startInput", "stopInput"]
			.forEach(
				actionFunction => it(`should throw error when ${actionFunction} executed on non existing input`, () => {
					// given
					const action = () => createService()[actionFunction]("non existing input");
					td
						.when(configurationMock.getInputs())
						.thenReturn([]);

					// expect
					expect(action).to.throw(Error);
				}));

		function mockProcess() {
			return {
				start: td.function(),
				stop: td.function()
			};
		}

		function mockInput(name) {
			return {name};
		}
	});


	function createService() {
		const InputService = proxyquire(
			"./InputService",
			{
				"../configuration": configurationMock,
				"./inputProcessFactory": inputProcessFactoryMock,
				"./websocket/websocketFactory": websocketFactoryMock
			}
		);
		return new InputService(httpServerMock);
	}
});
