'use strict';

import CBuffer from 'CBuffer';
import {Observable} from 'rxjs';

export default BufferingObservable;

function BufferingObservable(observable, bufferSize) {
	const buffer = new CBuffer(bufferSize);

	this.createObservable = createObservable;

	observable.subscribe(event => buffer.push(event));

	function createObservable() {
		return Observable.from(buffer.toArray());
	}
}
