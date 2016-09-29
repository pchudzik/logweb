'use strict';

const Observable = require('rxjs').Observable;
const Subject = require('rxjs').Subject;
const BufferingObservable = require('./BufferingObservable');
const rxHelper = require('./rxjs.spec-helper');
const expect = require('chai').expect;

describe('BufferingObservable.spec.js', () => {
	it('should send full buffer content', done => {
		//given
		const buffer = new BufferingObservable(Observable.of(1, 2, 3), 1000);

		//when
		const observable = buffer.createObservable();

		//then
		rxHelper.waitForEventsInOrder(done, observable, 1, 2, 3);
	});

	it('should send all new events', done => {
		//given
		const eventCreator = new Subject();
		const buffer = new BufferingObservable(eventCreator, 1);

		//when
		const observable = buffer.createObservable();

		//then
		broadcastAndWaitForEvent(eventCreator, observable, 'first',
			() => broadcastAndWaitForEvent(eventCreator, observable, 'second',
				() => broadcastAndWaitForEvent(eventCreator, observable, 'third', done)
			)
		);
	});

	function broadcastAndWaitForEvent(subject, observable, expectedEvent, done) {
		const subscription = observable.subscribe(event => {
			expect(event).to.eql(expectedEvent);
			cancelSubscription();
			done();
		});
		subject.next(expectedEvent);

		function cancelSubscription() {
			subscription.unsubscribe();
		}
	}
});
