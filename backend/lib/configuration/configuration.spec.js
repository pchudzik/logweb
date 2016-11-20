const proxyquire = require("proxyquire");
const expect = require("chai").expect;

describe("configuration.spec.js", () => {
	describe("provider inputs spec", () => {
		it("should execute user command with /bin/sh as default shell when passed as string", () => {
			// given
			const cmd = "echo hello";
			const configuration = createConfigurationWithConfig({
				inputs: [{
					cmd
				}]
			});

			// when
			const inputs = configuration.getInputs();

			// then
			expect(inputs).to.eql([{
				name: undefined,
				bufferSize: 100,
				providers: [{
					cmd: ["/bin/sh", "-c", cmd],
					log: defaultLogConfiguration()
				}]
			}]);
		});

		it("should use config shell when provided", () => {
			const cmd = "echo hello";
			const shell = ["cmd", "/c"];
			const configuration = createConfigurationWithConfig({
				shell,
				inputs: [{cmd}]
			});

			// when
			const inputs = configuration.getInputs();

			// then
			expect(inputs[0].providers[0].cmd[0]).to.eql("cmd");
			expect(inputs[0].providers[0].cmd[1]).to.eql("/c");
		});

		it("should parse all inputs", () => {
			const configuration = createConfigurationWithConfig({
				inputs: [
					{cmd: "echo 1", name: "first"},
					{cmd: "echo 2", name: "second"}
				]
			});

			// when
			const inputs = configuration.getInputs();

			// then
			expect(inputs).to.eql([
				{
					name: "first",
					bufferSize: 100,
					providers: [{
						cmd: ["/bin/sh", "-c", "echo 1"],
						log: defaultLogConfiguration()
					}]
				},
				{
					name: "second",
					bufferSize: 100,
					providers: [{
						cmd: ["/bin/sh", "-c", "echo 2"],
						log: defaultLogConfiguration()
					}]
				}
			]);
		});

		it("should parse input with multiple providers fully configured", () => {
			const configuration = createConfigurationWithConfig({
				inputs: [{
					name: "multi",
					bufferSize: 123,
					providers: [
						{cmd: "echo 1", name: "echo"},
						{cmd: ["/bin/bash", "-c", "echo 2"], name: "bash"}
					]
				}]
			});

			// when
			const inputs = configuration.getInputs();

			// then
			expect(inputs).to.eql([
				{
					name: "multi",
					bufferSize: 123,
					providers: [
						{
							name: "echo",
							cmd: ["/bin/sh", "-c", "echo 1"],
							log: defaultLogConfiguration()
						},
						{
							name: "bash",
							cmd: ["/bin/bash", "-c", "echo 2"],
							log: defaultLogConfiguration()
						}
					]
				}
			]);
		});

		describe("provider log configuration should be resolved", () => {
			[
				{},
				null,
				undefined
			].forEach(providerConfigurationObject => {
				it("should use default values when log not configured", () => {
					// given
					const configuration = providerWithLogConfiguration(providerConfigurationObject);

					// when
					const providerConfig = getSingleProviderConfiguration(configuration);

					// then
					expect(asString(providerConfig.log)).to.eq(asString(defaultLogConfiguration()));
				});
			});

			it("should use default logAppendTimeout when not provided", () => {
				// given
				const configuration = providerWithLogConfiguration({
					newLineRegexp: "(?=LOG:)"
				});

				// when
				const providerConfig = getSingleProviderConfiguration(configuration);

				// then
				expect(providerConfig.log).to.eql(Object.assign(
					defaultLogConfiguration(),
					{newLineRegexp: /(?=LOG:)/})
				);
			});

			it("should use default newLineRegexp pattern if no regexp provided", () => {
				// given
				const configuration = providerWithLogConfiguration({
					logAppendTimeout: 10
				});

				// when
				const providerConfig = getSingleProviderConfiguration(configuration);

				// then
				expect(providerConfig.log).to.eql(Object.assign(
					defaultLogConfiguration(),
					{logAppendTimeout: 10})
				);
			});

			function asString(object) {
				return JSON.stringify(object, null, 2);
			}

			function getSingleProviderConfiguration(configuration) {
				return configuration.getInputs()[0].providers[0];
			}

			function providerWithLogConfiguration(logConfiguration) {
				return createConfigurationWithConfig({
					inputs: [{
						name: "multi",
						bufferSize: 123,
						providers: [
							{
								cmd: "echo 1",
								name: "echo",
								log: logConfiguration
							}
						]
					}]
				});
			}
		});
	});

	describe("port spec", () => {
		it("should return default port when not set", () => {
			// when
			const configuration = createConfigurationWithConfig({});

			// then
			expect(configuration.getPort()).to.eql(8008);
		});

		it("should use configuration port when provided", () => {
			// when
			const configuration = createConfigurationWithConfig({port: 1234});

			// then
			expect(configuration.getPort()).to.eql(1234);
		});
	});

	describe("flush interval spec", () => {
		it("should return default flush interval when missing", () => {
			// when
			const configuration = createConfigurationWithConfig({});

			// then
			expect(configuration.getFlushInterval()).to.eql(500);
		});

		it("should use configuration flush interval when provided", () => {
			// when
			const configuration = createConfigurationWithConfig({flushInterval: 123});

			// then
			expect(configuration.getFlushInterval()).to.eql(123);
		});
	});

	function createConfigurationWithConfig(config) {
		return proxyquire("./configuration", {
			"./configurationRepository": {
				loadConfiguration: () => config
			}
		});
	}

	function defaultLogConfiguration() {
		return {
			logAppendTimeout: 300,
			newLineRegexp: /\n/
		};
	}
});
