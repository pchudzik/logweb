'use strict';

const CBuffer = require('CBuffer');
const Observable = require('rxjs').Observable;
const Subject = require('rxjs').Subject;

module.exports = function BufferingObservable(observable, bufferSize) {
	const buffer = new CBuffer(bufferSize);
	const forwardingObservable = new Subject();

	this.createObservable = createObservable;

	observable.subscribe(event => {
		buffer.push(event);
		forwardingObservable.next(event);
	});

	function createObservable() {
		return Observable.concat(Observable.from(buffer.toArray()), forwardingObservable);
	}
};
