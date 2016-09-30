const proxyquire = require("proxyquire");
const td = require("testdouble");
const expect = require("chai").expect;

describe("configurationParser.spec.js", () => {
	let fsMock;

	beforeEach(() => {
		fsMock = {
			mock: "my mock",
			readFileSync: td.function(),
		};
	});

	describe("provider inputs spec", () => {
		it("should execute user command with /bin/sh as default shell when passed as string", () => {
			// given
			const cmd = "echo hello";
			const configuration = createConfigurationWithConfig({
				inputs: [{
					cmd,
				}],
			});

			// when
			const inputs = configuration.getInputs();

			// then
			expect(inputs).to.eql([{
				name: undefined,
				bufferSize: 100,
				providers: [{ cmd: ["/bin/sh", "-c", cmd] }],
			}]);
		});

		it("should use config shell when provided", () => {
			const cmd = "echo hello";
			const shell = ["cmd", "/c"];
			const configuration = createConfigurationWithConfig({
				shell,
				inputs: [{ cmd }],
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
					{ cmd: "echo 1", name: "first" },
					{ cmd: "echo 2", name: "second" },
				],
			});

			// when
			const inputs = configuration.getInputs();

			// then
			expect(inputs).to.eql([
				{
					name: "first",
					bufferSize: 100,
					providers: [{ cmd: ["/bin/sh", "-c", "echo 1"] }],
				},
				{
					name: "second",
					bufferSize: 100,
					providers: [{ cmd: ["/bin/sh", "-c", "echo 2"] }],
				},
			]);
		});

		it("should parse input with multiple providers fully configured", () => {
			const configuration = createConfigurationWithConfig({
				inputs: [{
					name: "multi",
					bufferSize: 123,
					providers: [
						{ cmd: "echo 1", name: "echo" },
						{ cmd: ["/bin/bash", "-c", "echo 2"], name: "bash" },
					],
				}],
			});

			// when
			const inputs = configuration.getInputs();

			// then
			expect(inputs).to.eql([
				{
					name: "multi",
					bufferSize: 123,
					providers: [
						{ name: "echo", cmd: ["/bin/sh", "-c", "echo 1"] },
						{ name: "bash", cmd: ["/bin/bash", "-c", "echo 2"] },
					],
				},
			]);
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
			const configuration = createConfigurationWithConfig({ port: 1234 });

			// then
			expect(configuration.getPort()).to.eql(1234);
		});
	});


	function createConfigurationWithConfig(config) {
		mockConfig(config);
		return proxyquire("./configuration", {
			fs: fsMock,
		});
	}

	function mockConfig(configObject) {
		const configString = JSON.stringify(configObject);
		td.when(fsMock.readFileSync(), { ignoreExtraArgs: true }).thenReturn(configString);
	}
});
