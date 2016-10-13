import td from "testdouble";
import {expect} from "chai";
import {
	startFollowing,
	stopFollowing,
	START_FOLLOWING,
	STOP_FOLLOWING,
	LOG_EVENT,
	__RewireAPI__ as LogActionsRewire
} from "./logActions";

class WebSocketMock {
	constructor(url) {
		this.url = url;
		this.onmessage = null;
	}
}

describe("logActions.spec.jsx", () => {
	const resolveHost = () => "example.com";
	const resolvePort = () => 8008;
	let dispatchMock;
	let windowMock;
	let windowBak;

	beforeEach(() => {
		windowBak = global.window;

		dispatchMock = td.function("dispatch mock");
		windowMock = {
			WebSocket: WebSocketMock
		};
		global.window = windowMock;

		LogActionsRewire.__Rewire__("resolveHost", resolveHost);
		LogActionsRewire.__Rewire__("resolvePort", resolvePort);
	});

	afterEach(() => {
		global.window = windowBak;
	});

	it(`should dispatch ${START_FOLLOWING} action with payload`, () => {
		// given
		const logName = "log-to-follow";

		// when
		startFollowing(logName)(dispatchMock);

		// then
		td.verify(dispatchMock(td.matchers.argThat(action => {
			const webSocoket = action.payload.webSocket;
			expect(action.type).to.eql(START_FOLLOWING);
			expect(webSocoket.url).to.eql(`ws://${resolveHost()}:${resolvePort()}/api/ws/${logName}`);
			return true;
		})));
	});

	it(`should dispatch ${LOG_EVENT} action on new event`, () => {
		// given
		const logName = "log-to-follow";
		const webSocketEvent1 = {data: "event data 1"};
		const webSocketEvent2 = {data: "event data 2"};
		let webSocket;
		td.when(dispatchMock(td.matchers.contains({type: START_FOLLOWING})))
			.thenDo(action => {
				webSocket = action.payload.webSocket;
			});
		startFollowing(logName)(dispatchMock);

		// when
		webSocket.onmessage(webSocketEvent1);

		// then
		td.verify(dispatchMock({
			type: LOG_EVENT,
			payload: webSocketEvent1
		}));

		// when
		webSocket.onmessage(webSocketEvent2);

		// then
		td.verify(dispatchMock({
			type: LOG_EVENT,
			payload: webSocketEvent2
		}));
	});

	it(`should dispatch ${STOP_FOLLOWING}`, () => {
		// given
		const logName = "any log name";
		const webSocket = new WebSocketMock("any url");
		webSocket.onmessage = "any message handler";
		webSocket.close = td.function();

		// when
		const result = stopFollowing(logName, webSocket);

		// then
		expect(result).to.eql({
			type: STOP_FOLLOWING,
			payload: {logName, webSocket: null}
		});
		expect(webSocket.onmessage).to.be.null;		// eslint-disable-line no-unused-expressions
		td.verify(webSocket.close());
	});
});
