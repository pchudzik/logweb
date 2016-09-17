'use strict';

import {expect} from 'chai';
import td from 'testdouble';
import proxyquire from 'proxyquire';
import EventEmitter from 'events';

describe('Input.spec.js', () => {
	let respawnMock;

	let dataListener;
	let Input;

	beforeEach(() => {
		respawnMock = new RespawnMock();
		dataListener = td.function();

		Input = proxyquire('./Input', {
				respawn: function () {
					return respawnMock;
				}
			}
		).default;
	});

	it('should send event to data listener', () => {
		//given
		const processResult = 'process result';
		const providerName = 'provider 1';

		//when
		new Input({name: providerName}, dataListener);
		respawnMock.emit('stdout', processResult);

		//then
		td.verify(dataListener(td.matchers.argThat(inputEvent => {
			expect(inputEvent.timestamp).to.be.number;
			expect(inputEvent.data).to.eql(processResult);
			expect(inputEvent.providerName).to.eql(providerName);
			return true;
		})));
	});

	class RespawnMock extends EventEmitter {
		start() {
		}
	}
});