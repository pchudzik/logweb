'use strict';

import proxyquire from 'proxyquire';
import td from 'testdouble';
import {expect} from 'chai';

describe('configurationParser.spec.js', () => {
	let fsMock;

	beforeEach(() => {
		fsMock = {
			mock: 'my mock',
			readFileSync: td.function()
		};
	});

	describe('provider inputs spec', () => {
		it('should execute user command with /bin/sh as default shell when passed as string', () => {
			//given
			const cmd = 'echo hello';
			const configuration = createConfigurationWithConfig({
				inputs: [{
					cmd: cmd
				}]
			});

			//when
			const inputs = configuration.getInputs();

			//then
			expect(inputs).to.eql([{
				name: undefined,
				cmd: ['/bin/sh', '-c', cmd]
			}]);
		});

		it('should use config shell when provided', () => {
			const cmd = 'echo hello';
			const shell = ['cmd', '/c'];
			const configuration = createConfigurationWithConfig({
				shell: shell,
				inputs: [{cmd: cmd}]
			});

			//when
			const inputs = configuration.getInputs();
			expect(inputs[0].cmd[0]).to.eql('cmd');
			expect(inputs[0].cmd[1]).to.eql('/c');
		});

		it('should parse all inputs', () => {
			const configuration = createConfigurationWithConfig({
				inputs: [
					{cmd: 'echo 1',name:'first'},
					{cmd: 'echo 2', name:'second'}
				]
			});

			//when
			const inputs = configuration.getInputs();

			//then
			expect(inputs).to.eql([
				{cmd: ['/bin/sh', '-c', 'echo 1'], name: 'first'},
				{cmd: ['/bin/sh', '-c', 'echo 2'], name: 'second'}
			]);
		});
	});

	describe('port spec', function() {
		it('should return default port when not set', function () {
			//when
			const configuration = createConfigurationWithConfig({});

			//then
			expect(configuration.getPort()).to.eql(8008);
		});

		it('should use configuration port when provided', function () {
			//when
			const configuration = createConfigurationWithConfig({port: 1234});

			//then
			expect(configuration.getPort()).to.eql(1234);
		});
	});


	function createConfigurationWithConfig(config) {
		mockConfig(config);
		return proxyquire('./configuration', {
			fs: fsMock
		}).default;
	}

	function mockConfig(configObject) {
		const configString = JSON.stringify(configObject);
		td.when(fsMock.readFileSync(), {ignoreExtraArgs: true}).thenReturn(configString);
	}
});
