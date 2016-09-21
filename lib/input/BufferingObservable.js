'use strict';

const CBuffer = require('CBuffer');
const Observable = require('rxjs').Observable;

module.exports = function BufferingObservable(observable, bufferSize) {
	const buffer = new CBuffer(bufferSize);

	this.createObservable = createObservable;

	observable.subscribe(event => buffer.push(event));

	function createObservable() {
		return Observable.from(buffer.toArray());
	}
};
