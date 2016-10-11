module.exports = {
	// port on which backend will be exposed
	port: 8008,

	// default shell with which providers should be executed
	// Default shell is /bin/sh -c
	// for example command executed will be `sh -c tail -f /var/log/syslog`
	defaultShell: ["sh", "-c"],

	// list of inputs
	inputs: [
		{
			// name of the input. Must be valid url. Will be used as websocket handle
			name: "syslog",

			// command which will provide data for input. logweb handle only stdout
			cmd: "tail -f /var/log/syslog",

			// list of entries to be keep in memory. default is 100
			buffer: 5000
		},
		{
			name: "example",
			providers: [
				{
					name: "node2",
					cmd: "node fake-input.js"
				}
			]
		},
		{
			name: "two-nodes",
			// single input can be composed from multiple providers
			// all data will be merged into single 'stream'
			providers: [
				{
					// name of the provider. In the future it will allow to filter data by provider
					name: "node1",

					// command to execute for this provider. Same as inputs[0].cmd
					cmd: ["./random.sh", "node1 logger"]
				},
				{
					name: "node2",
					cmd: ["./random.sh", "node2 logger"]
				}
			]
		}
	]
};
