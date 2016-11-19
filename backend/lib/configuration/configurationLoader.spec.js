const td = require("testdouble");
const proxyquire = require("proxyquire");
const expect = require("chai").expect;

describe("configurationLoader.spec.js", () => {
	const cwd = "/home/pawel/workspace/logweb";

	let configuration;
	let processCwdMock;
	let argvSliceMock;

	beforeEach(() => {
		configuration = {
			any: "configuration",
			entry: "value",
			"@noCallThru": true
		};
		processCwdMock = td.replace(process, "cwd");
		argvSliceMock = td.replace(process.argv, "slice");
	});

	afterEach(() => {
		td.reset();
	});

	it("should load configuration from command argv", () => {
		// given
		const configFile = "config/custom-config.js";
		td.when(processCwdMock()).thenReturn(cwd);
		td.when(argvSliceMock(2)).thenReturn([configFile]);

		// when
		const config = proxyquire("./configurationLoader", requireOverwrite(configFile));

		// then
		expect(config).to.eql(configuration);
	});

	it("should load configuration from file named logweb.js in current working directory", () => {
		// given
		td.when(processCwdMock()).thenReturn(cwd);
		td.when(argvSliceMock(2)).thenReturn([]);

		// when
		const config = proxyquire("./configurationLoader", requireOverwrite("logweb.js"));

		// then
		expect(config).to.eql(configuration);
	});

	function requireOverwrite(configFile) {
		const result = {};
		result[cwd + "/" + configFile] = configuration;
		return result;
	}
});
