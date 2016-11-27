const proxyquire = require("proxyquire");
const td = require("testdouble");
const expect = require("chai").expect;

describe("configuration.spec.js", () => {
	let repositoryMock;

	describe("global configuration failure", () => {
		it("should fail on missing flush interval", () => {
			// given
			const config = createConfigurationWithConfig({port: 9000});

			// expect
			expect(
				() => config.getFlushInterval()
			).to.throw(
				Error, /missing flush interval/
			);
		});

		it("should fail on missing listen port", () => {
			// given
			const config = createConfigurationWithConfig({flushInterval: 1000});

			// expect
			expect(
				() => config.getPort()
			).to.throw(
				Error, /missing port/
			);
		});
	});

	describe("provider inputs spec", () => {
		describe("input configuration failure", () => {
			const name = "any-name";
			const shell = ["/bin/bash", "-c"];
			const cmd = ["echo cmd"];
			const log = {
				newLineRegexp: "/n",
				logAppendTimeout: 100
			};
			const buffer = 500;

			it("should fail on missing input name", () => {
				// given
				const config = createConfigurationWithConfig(Object.assign(
					rootConfiguration(),
					inputs({})
				));

				// expect
				expect(
					() => config.getInputs()
				).to.throw(
					Error, /missing input name/
				);
			});

			[
				null,
				[],
				undefined
			].forEach(providers => it(`should fail when no provider provided [${providers}]`, () => {
				// given
				const config = createConfigurationWithConfig(Object.assign(
					rootConfiguration(),
					inputs({
						name,
						buffer,
						providers
					})));

				// expect
				expect(
					() => config.getInputs()
				).to.throw(
					Error, /missing providers/
				);
			}));

			it("should fail when provider name not provided", () => {
				// given
				const config = createConfigurationWithConfig(Object.assign(
					rootConfiguration(),
					anyInput({
						cmd,
						shell,
						log
					})
				));

				// expect
				expect(
					() => config.getInputs()
				).to.throw(
					Error, /missing provider name/
				);
			});

			it("should fail when provider cmd not provided", () => {
				// given
				const config = createConfigurationWithConfig(Object.assign(
					rootConfiguration(),
					anyInput({
						name,
						shell,
						log
					})
				));

				// expect
				expect(
					() => config.getInputs()
				).to.throw(
					Error, /missing provider cmd/
				);
			});

			it("should fail when provider shell not set", () => {
				// given
				const config = createConfigurationWithConfig(Object.assign(
					rootConfiguration(),
					anyInput({
						name,
						cmd,
						log
					})
				));

				// expect
				expect(
					() => config.getInputs()
				).to.throw(
					Error, /missing provider shell/
				);
			});

			[
				null,
				undefined
			].forEach(logConfig => it("should fail when provider log missing", () => {
				// given
				const config = createConfigurationWithConfig(Object.assign(
					rootConfiguration(),
					anyInput({
						name,
						cmd,
						shell,
						log: logConfig
					})
				));

				// expect
				expect(
					() => config.getInputs()
				).to.throw(
					Error, /missing provider log configuration/
				);
			}));

			it("should fail when log newLineRegexp is missing", () => {
				// given
				const config = createConfigurationWithConfig(Object.assign(
					rootConfiguration(),
					anyInput({
						name,
						cmd,
						shell,
						log: {
							logAppendTimeout: 100
						}
					})
				));

				// expect
				expect(
					() => config.getInputs()
				).to.throw(
					Error, /missing log configuration new line regexp/
				);
			});

			it("should fail when log logAppendTimeout is missing", () => {
				// given
				const config = createConfigurationWithConfig(Object.assign(
					rootConfiguration(),
					anyInput({
						name,
						cmd,
						shell,
						log: {
							newLineRegexp: "/n"
						}
					})
				));

				// expect
				expect(
					() => config.getInputs()
				).to.throw(
					Error, /missing log configuration logAppendTimeout/
				);
			});

			function rootConfiguration() {
				return {
					port: 9000,
					flushInterval: 100
				};
			}

			function anyInput(provider) {
				return inputs({
					name,
					buffer,
					providers: [provider]
				});
			}

			function inputs(inputConfig) {
				return {inputs: [inputConfig]};
			}
		});
	});

	it("should parse inputs", () => {
		// given
		const firstInput = {
			name: "first",
			buffer: 100,
			providers: [
				{
					name: "first provider",
					shell: ["/bin/bash", "-e"],
					cmd: ["echo hello"],
					log: {
						newLineRegexp: "/n",
						logAppendTimeout: 100
					}
				}
			]
		};
		const secondInput = {
			name: "second",
			buffer: 50,
			providers: [
				{
					name: "second",
					shell: ["/bin/bash", "-s"],
					cmd: ["echo hello2"],
					log: {
						newLineRegexp: ",",
						logAppendTimeout: 200
					}
				}
			]
		};
		const config = createConfigurationWithConfig({
			port: 1,
			flushInterval: 2,
			inputs: [firstInput, secondInput]
		});

		// then
		expect(
			config.getInputs()
		).to.eql(
			[
				firstInput,
				secondInput
			]
		);
	});

	it("should get port", () => {
		expect(
			createConfigurationWithConfig({
				port: 1234,
				flushInterval: 10
			}).getPort()
		).to.eql(
			1234
		);
	});

	it("should get flush interval", () => {
		expect(
			createConfigurationWithConfig({
				port: 1234,
				flushInterval: 10
			}).getFlushInterval()
		).to.eql(
			10
		);
	});

	it("should delete input", () => {
		// given
		const firstInput = {
			name: "first",
			buffer: 10,
			providers: [
				{
					name: "first provider",
					shell: ["/bin/bash", "-e"],
					cmd: ["echo hello"],
					log: {
						newLineRegexp: "/n",
						logAppendTimeout: 100
					}
				}
			]
		};
		const inputToDelete = {
			name: "to-delete",
			buffer: 200,
			providers: [
				{
					name: "provider to delete",
					shell: ["/bin/bash", "-s"],
					cmd: ["echo delete me"],
					log: {
						newLineRegexp: ",",
						logAppendTimeout: 200
					}
				}
			]
		};
		const config = createConfigurationWithConfig({
			port: 1,
			flushInterval: 2,
			inputs: [
				firstInput,
				inputToDelete
			]
		});

		// when
		config.deleteInput(inputToDelete.name);

		// then
		td.verify(
			repositoryMock.saveConfiguration(
				td.matchers.argThat(
					savedConfig => expect(
						savedConfig
					).to.eql({
						port: 1,
						flushInterval: 2,
						inputs: [firstInput]
					})
				)
			)
		);
	});

	it("should save input", () => {
		// given
		const firstInput = {
			name: "first",
			buffer: 100,
			providers: [
				{
					name: "first provider",
					shell: ["/bin/bash", "-e"],
					cmd: ["echo hello"],
					log: {
						newLineRegexp: "/n",
						logAppendTimeout: 100
					}
				}
			]
		};
		const inputToSave = {
			name: "to-save",
			buffer: 50,
			providers: [
				{
					name: "provider to save",
					shell: ["/bin/bash", "-s"],
					cmd: ["echo save me"],
					log: {
						newLineRegexp: ",",
						logAppendTimeout: 200
					}
				}
			]
		};
		const config = createConfigurationWithConfig({
			port: 1,
			flushInterval: 2,
			inputs: [firstInput]
		});

		// when
		config.saveInput(inputToSave);

		// then
		td.verify(
			repositoryMock.saveConfiguration(
				td.matchers.argThat(
					savedConfig => expect(
						savedConfig
					).to.eql({
						port: 1,
						flushInterval: 2,
						inputs: [
							firstInput,
							inputToSave
						]
					})
				)
			)
		);
	});

	function createConfigurationWithConfig(config) {
		repositoryMock = {
			loadConfiguration: () => config,
			saveConfiguration: td.function()
		};

		return proxyquire("./configuration", {
			"./configurationRepository": repositoryMock
		});
	}
});
