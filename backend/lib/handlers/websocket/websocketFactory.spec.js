const _ = require("lodash");
const Observable = require("rxjs").Observable;
const Subject = require("rxjs").Subject;
const http = require("http");
const websocketFactory = require("./websocketFactory");
const ws = require("ws");
const expect = require("chai").expect;

class InputEvent {
	constructor(data, providerName) {
		this.data = data;
		this.providerName = providerName;
	}
}

describe("websocketFactory.spec.js", () => {
	let httpServer;
	let serverPort;

	let websocketClient;
	let websocketServer;

	before(done => {
		httpServer = http.createServer();
		httpServer.listen();
		httpServer.on("listening", () => {
			serverPort = httpServer.address().port;
			done();
		});
	});

	after(done => {
		httpServer.close(done);
	});

	afterEach(() => {
		websocketClient.close();
		websocketServer.close();
	});

	it("should send all events to new client", done => {
		// given
		const observable = Observable.of(
			[new InputEvent("first1", "provider1"), new InputEvent("second1", "provider1")],
			[new InputEvent("first2", "provider2"), new InputEvent("second2", "provider2")]);

		websocketServer = websocketFactory(
			{server: httpServer, path: "/ws"},
			{createDataObservable: _.constant(observable)});

		// when
		websocketClient = ws.createConnection(`ws://localhost:${serverPort}/ws`);

		// then
		expectEvents(websocketClient, done,
			"[{\"data\":\"first1\",\"providerName\":\"provider1\"},{\"data\":\"second1\",\"providerName\":\"provider1\"}]",
			"[{\"data\":\"first2\",\"providerName\":\"provider2\"},{\"data\":\"second2\",\"providerName\":\"provider2\"}]");
	});

	it("should not fail when clients disconnects", done => {
		// given
		const subject = new Subject();
		websocketServer = websocketFactory(
			{server: httpServer, path: "/ws"},
			{createDataObservable: _.constant(subject)});

		websocketClient = ws.createConnection(`ws://localhost:${serverPort}/ws`, () => {
			// when
			websocketClient.close();
		});

		// then no error on message send
		websocketClient.on("close", () => {
			subject.next("value");
			done();
		});
	});

	it("should send update events to client", done => {
		// given
		const observable = new Subject();

		websocketServer = websocketFactory(
			{server: httpServer, path: "/ws"},
			{createDataObservable: _.constant(observable)});

		// when
		websocketClient = ws.createConnection(`ws://localhost:${serverPort}/ws`, () => {
			// then
			expectEvents(websocketClient, done,
				"[{\"data\":\"first\"}]",
				"[{\"data\":\"second\"}]");

			// when
			observable.next(new InputEvent("first"));
			observable.next(new InputEvent("second"));
		});
	});

	function expectEvents(client, done, ...events) {
		client.on("message", event => {
			const expectedEvent = events.splice(0, 1)[0];
			expect(event).to.eql(expectedEvent);
			if (events.length === 0) {
				done();
			}
		});
	}
});
