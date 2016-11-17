module.exports = class InputsHandler {
	constructor(inputService) {
		this.inputService = inputService;
	}

	setup(expressApp) {
		expressApp.get("/api/inputs", this.listInputs.bind(this));
		expressApp.get("/api/inputs/:inputName", this.getInput.bind(this));
		expressApp.post("/api/inputs/:inputName/actions", this.executeActionOnInput.bind(this));
	}

	listInputs(req, resp) {
		resp.json(this.inputService.getInputs());
	}

	getInput(req, resp) {
		const input = this.inputService.getInput(req.params.inputName);
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
				return this.inputService.stopInput(req.params.inputName)
					.then(() => resp.status(200).end());
			case "START":
				return this.inputService.startInput(req.params.inputName)
					.then(() => resp.status(200).end());
			default:
				return resp
					.status(400)
					.json({error: "Invalid action type"});
		}
	}
};
