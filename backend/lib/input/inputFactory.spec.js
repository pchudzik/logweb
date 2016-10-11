const Observable = require("rxjs").Observable;
const Subject = require("rxjs").Subject;
const rxHelper = require("./rxjs.spec-helper");
const td = require("testdouble");
const proxyquire = require("proxyquire");

describe("inputFactory.spec.js", () => {
	let InputMock;
	let inputFactory;

	beforeEach(() => {
		InputMock = td.function();
		InputMock["@noCallThru"] = true;

		inputFactory = proxyquire("./inputFactory", {
			"./Input": InputMock
		});
	});

	describe("input events spec", () => {
		it("should keep old events history in history buffer", (done) => {
			// given
			const provider = createProvider("any provider");
			const observable = new Subject();
			mockInputWithObservable(provider, observable);
			const inputConfiguration = {
				bufferSize: 3,
				providers: [provider]
			};

			// when
			const input = inputFactory(inputConfiguration);

			// and
			observable.next(1);
			observable.next(2);
			observable.next(3);

			// then
			rxHelper.waitForEventsInOrder(done, input.createDataObservable(), 1, 2, 3);
		});

		it("should merge events from multiple streams into single observable", (done) => {
			// given
			const lettersProvider = createProvider("letters");
			const numbersProvider = createProvider("numbers");
			mockInputWithObservable(lettersProvider, Observable.of("a", "b", "c"));
			mockInputWithObservable(numbersProvider, Observable.of(1, 2, 3));
			const inputConfiguration = {
				bufferSize: 1000,
				providers: [lettersProvider, numbersProvider]
			};

			// when
			const input = inputFactory(inputConfiguration);

			// then
			rxHelper.waitForEventsInOrder(done, input.createDataObservable(),
				"a", "b", "c",
				1, 2, 3);
		});

		it("should merge envets in order they occure", (done) => {
			const lettersProvider = createProvider("letters");
			const numbersProvider = createProvider("numbers");
			const lettersObservable = new Subject();
			const numbersObservable = new Subject();
			mockInputWithObservable(lettersProvider, lettersObservable);
			mockInputWithObservable(numbersProvider, numbersObservable);
			const inputConfiguration = {
				bufferSize: 1000,
				providers: [lettersProvider, numbersProvider]
			};

			// when
			const input = inputFactory(inputConfiguration);

			// and
			lettersObservable.next("a");
			numbersObservable.next(1);
			lettersObservable.next("b");
			numbersObservable.next(2);

			// then
			rxHelper.waitForEventsInOrder(done, input.createDataObservable(), "a", 1, "b", 2);
		});
	});

	describe("process monitors start/stop", () => {
		let provider1;
		let provider2;
		let inputProcess1;
		let inputProcess2;
		let input;

		beforeEach(() => {
			provider1 = createProvider("1");
			provider2 = createProvider("2");
			inputProcess1 = mockInputWithObservable(provider1, Observable.empty());
			inputProcess2 = mockInputWithObservable(provider2, Observable.empty());
			input = inputFactory({ providers: [provider1, provider2] });
		});

		it("should start all process monitors", () => {
			// when
			input.start();

			// then
			td.verify(inputProcess1.start(), { times: 1 });
			td.verify(inputProcess2.start(), { times: 1 });
		});

		it("should stop all process monitors", () => {
			// when
			input.stop();

			// then
			td.verify(inputProcess1.stop(), { times: 1 });
			td.verify(inputProcess2.stop(), { times: 1 });
		});
	});

	function mockInputWithObservable(provider, observable) {
		const resultInputProcess = inputMockCreator(observable);

		td.when(InputMock(provider)).thenReturn(resultInputProcess);	// eslint-disable-line new-cap

		return resultInputProcess;
	}

	function inputMockCreator(observable) {
		return {
			start: td.function(),
			stop: td.function(),
			data: {
				stdout: observable
			}
		};
	}

	function createProvider(name) {
		return {
			name
		};
	}
});
