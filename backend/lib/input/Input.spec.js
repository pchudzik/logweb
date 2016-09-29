'use strict';

const _ = require('lodash');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const EventEmitter = require('events');

describe('Input.spec.js', () => {
	let respawnMock;

	let Input;

	beforeEach(() => {
		respawnMock = new RespawnMock();

		Input = proxyquire('./Input', {
				respawn: function () {
					return respawnMock;
				}
			}
		);
	});

	it('should send event to data listener', done => {
		//given
		const processResult = 'process result';
		const providerName = 'provider 1';
		const input = new Input({name: providerName});

		//when
		input.start();

		//then
		input.data.stdout
			.subscribe(inputEvent => {
				expect(inputEvent.timestamp).to.be.number;
				expect(inputEvent.data).to.eql(processResult);
				expect(inputEvent.providerName).to.eql(providerName);
				done();
			});

		respawnMock.emit('stdout', processResult);
	});

	it('should complete observable on process stop', done => {
		//given
		const input = new Input({name: 'any provider'});

		//when
		input.stop();

		//then
		input.data.stdout
			.subscribe(_.noop, _.noop, done);
	});

	class RespawnMock extends EventEmitter {
		start() {
		}

		stop() {
		}
	}
});