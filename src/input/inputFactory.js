'use strict';

import {Observable} from 'rxjs';
import BufferedObservable from './BufferingObservable';
import Input from './Input';

export default function inputFactory(inputConfiguration) {
	const providers = inputConfiguration.providers.map(provider => new Input(provider));

	return {
		name: inputConfiguration.name,
		start: startAll,
		stop: stopAll,
		createDataObservable: createObservable(providers)
	};

	function startAll() {
		providers.forEach(provider => provider.start());
	}

	function stopAll() {
		providers.forEach(provider => provider.stop());
	}

	function createObservable(providers) {
		const mergedObservable = providers.reduce(
			(result, provider) => result.merge(provider.data.stdout),
			Observable.empty());
		const bufferedObservable = new BufferedObservable(mergedObservable, inputConfiguration.bufferSize);

		return bufferedObservable.createObservable;
	}
}
