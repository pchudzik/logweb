'use strict';

import {expect} from 'chai';
import proxyquire from 'proxyquire';
import EventEmitter from 'events';

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
		).default;
	});

	it('should send event to data listener', (done) => {
		//given
		const processResult = 'process result';
		const providerName = 'provider 1';
		const input = new Input({name: providerName});

		//when
		input.start()

		//then
			.data
			.subscribe(inputEvent => {
				expect(inputEvent.timestamp).to.be.number;
				expect(inputEvent.data).to.eql(processResult);
				expect(inputEvent.providerName).to.eql(providerName);
				done();
			});

		respawnMock.emit('stdout', processResult);
	});

	class RespawnMock extends EventEmitter {
		start() {
		}
	}
});
