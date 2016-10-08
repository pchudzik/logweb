export const resolveHost = window => window.location.hostname;
export const resolvePort = window => {
	const port = window.location.port;
	if (!port) {
		const protocol = window.location.host.replace(/:.*/, "");
		return protocol === "https" ? 443 : 80;
	}
	return parseInt(port, 10);
};

