module.exports = {
	// number of ms between data flush to frontend (to avoid sending 1 event every 1ms)
	flushInterval: 2000,

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
					cmd: "node sample-log/logGenerator.js sample-log/java.log 2000 5500",
					log: {
						// single log entry message is detected based on this pattern. Default pattern new line
						// it must be RegExp object
						newLineRegexp: /(?=\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/,

						// if message can be flushed in multiple chunks how long to wait before
						// flushing message for further processing
						logAppendTimeout: 6000
					}
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
					cmd: ["node", "sample-log/randomLog.js", "node1 logger"]
				},
				{
					name: "node2",
					cmd: ["node", "sample-log/randomLog.js", "node2 logger"]
				}
			]
		}
	]
};
