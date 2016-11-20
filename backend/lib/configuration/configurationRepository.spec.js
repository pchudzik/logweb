const td = require("testdouble");
const proxyquire = require("proxyquire");
const expect = require("chai").expect;

describe("configurationRepository.spec.js", () => {
	const cwd = "/home/pawel/workspace/logweb";
	const configurationData = {any: "configuration value"};

	let configurationRepository;
	let fsMock;
	let processCwdMock;
	let argvSliceMock;

	beforeEach(() => {
		fsMock = {
			readFileSync: td.function(),
			writeFile: td.function(),
			"@noCallThru": true
		};
		processCwdMock = td.replace(process, "cwd");
		argvSliceMock = td.replace(process.argv, "slice");
		td.when(processCwdMock()).thenReturn(cwd);

		configurationRepository = proxyquire("./configurationRepository", {fs: fsMock});
	});

	afterEach(() => {
		td.reset();
	});

	describe("argv configuration", () => {
		const configFile = "config/custom-config.json";

		beforeEach(() => {
			td.when(argvSliceMock(2)).thenReturn([configFile]);
		});

		it("should load configuration from command argv", () => {
			// given
			td.when(fsMock.readFileSync(`${cwd}/${configFile}`, "utf8")).thenReturn(JSON.stringify(configurationData));

			// expect
			expect(configurationRepository.loadConfiguration()).to.eql(configurationData);
		});

		it("should save configuration file to argv parameter", done => {
			// given
			td.when(
				fsMock.writeFile(
					`${cwd}/${configFile}`,
					JSON.stringify(configurationData, null, 2),
					"utf8"),
				{ignoreExtraArgs: true}
			).thenCallback(null);

			// when
			configurationRepository
				.saveConfiguration(configurationData)
				.then(() => done());
		});
	});

	describe("default configuration location", () => {
		beforeEach(() => {
			td.when(argvSliceMock(2)).thenReturn([]);
		});

		it("should load configuration from file named logweb.json in current working directory", () => {
			// given
			td.when(fsMock.readFileSync(`${cwd}/logweb.json`, "utf8")).thenReturn(JSON.stringify(configurationData));

			// expect
			expect(configurationRepository.loadConfiguration()).to.eql(configurationData);
		});

		it("should save configuration to file named logweb.json in current working directory", done => {
			// given
			td.when(
				fsMock.writeFile(
					`${cwd}/logweb.json`,
					JSON.stringify(configurationData, null, 2),
					"utf8"),
				{ignoreExtraArgs: true}
			).thenCallback(null);

			// when
			configurationRepository
				.saveConfiguration(configurationData)
				.then(() => done());
		});
	});
});
