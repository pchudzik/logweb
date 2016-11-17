const Observable = require("rxjs").Observable;
const BufferedObservable = require("./BufferingObservable");
const Input = require("./InputProcess");

module.exports = function inputFactory(inputConfiguration) {
	const providers = inputConfiguration.providers
		.map(providerConfiguration => new Input(providerConfiguration));

	return {
		name: inputConfiguration.name,
		start: startAll,
		stop: stopAll,
		status,
		createDataObservable: createObservable(providers)
	};

	function startAll() {
		providers.forEach(provider => provider.start());
	}

	function stopAll() {
		providers.forEach(provider => provider.stop());
	}

	function status() {
		return providers.map(provider => ({
			name: provider.name,
			status: provider.status()
		}));
	}

	function createObservable(inputProviders) {
		const mergedObservable = inputProviders.reduce(
			(result, provider) => result.merge(provider.data.stdout),
			Observable.empty());

		const bufferedObservable = new BufferedObservable(
			mergedObservable,
			inputConfiguration.bufferSize);

		return bufferedObservable.createObservable;
	}
};
