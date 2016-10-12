const configuration = require("../../configuration");

module.exports = class InputsHandler {
	setup(expressApp) {
		expressApp.get("/api/inputs", this.listInputs);
		expressApp.get("/api/inputs/:inputName", this.getInput);
	}

	static listInputs(req, resp) {
		resp.json(configuration
			.getInputs()
			.map(pickName));
	}

	static getInput(req, resp) {
		const event = configuration
			.getInputs()
			.filter(input => input.name === req.params.inputName)
			.map(input => ({
				name: input.name,
				providers: input.providers.map(pickName)
			}));
		if (event.length === 0) {
			resp
				.status(404)
				.json({
					error: `No input with name ${req.params.inputName}`
				});
		} else {
			resp.json(event[0]);
		}
	}
};

function pickName(object) {
	return {name: object.name};
}
