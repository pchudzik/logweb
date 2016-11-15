const inputService = require("../../input/inputService");

module.exports = class InputsHandler {
	setup(expressApp) {
		expressApp.get("/api/inputs", this.listInputs);
		expressApp.get("/api/inputs/:inputName", this.getInput);
		expressApp.post("/api/inputs/:inputName/actions", this.executeActionOnInput);
	}

	listInputs(req, resp) {
		resp.json(inputService.getInputs());
	}

	getInput(req, resp) {
		const input = inputService.getInput(req.params.inputName);
		if (!input) {
			resp
				.status(404)
				.json({
					error: `No input with name ${req.params.inputName}`
				});
		} else {
			resp.json(input);
		}
	}

	executeActionOnInput(req, resp) {
		const {action} = req.body;
		switch (action) {
			case "STOP":
				return inputService.stopInput(req.params.inputName)
					.then(() => resp.status(200).end());
			case "START":
				return inputService.startInput(req.params.inputName)
					.then(() => resp.status(200).end());
			default:
				return resp
					.status(400)
					.json({error: "Invalid action type"});
		}
	}
};
