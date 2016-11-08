const _ = require("lodash");
const expect = require("chai").expect;
const proxyquire = require("proxyquire");
const EventEmitter = require("events");
const Subject = require("rxjs").Subject;

class RespawnMock extends EventEmitter {
	start() {
	}

	stop() {
	}
}

describe("Input.spec.js", () => {
	let respawnMock;

	let Input;

	beforeEach(() => {
		respawnMock = new RespawnMock();

		Input = proxyquire("./Input", {
			"../process/logProcessorFactory": logProcessorFactoryMock,
			respawn() {
				return respawnMock;
			}
		});
	});

	it("should send event to data listener", done => {
		// given
		const processResult = ["process result 1", "another output"];
		const providerName = "provider 1";
		const input = new Input({name: providerName});

		// when
		input.start();

		// then
		input.data.stdout
			.subscribe(inputEvents => {
				[0, 1].forEach(index => {
					const event = inputEvents[index];

					expect(event.timestamp).to.be.number; // eslint-disable-line no-unused-expressions
					expect(event.data).to.eql(processResult[index]);
					expect(event.providerName).to.eql(providerName);
				});

				done();
			});

		respawnMock.emit("stdout", processResult);
	});

	it("should complete observable on process stop", done => {
		// given
		const input = new Input({name: "any provider"});

		// when
		input.stop();

		// then
		input.data.stdout
			.subscribe(_.noop, _.noop, done);
	});

	function logProcessorFactoryMock() {
		const observable = new Subject();
		return {
			appendText: data => observable.next(data),
			observable
		};
	}
});
