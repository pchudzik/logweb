export const emptyRequest = () => ({
	fetched: false,
	fetching: false,
	error: null
});

export const pendingRequest = () => ({
	fetching: true,
	fetched: false,
	error: null
});

export const fulfilledRequest = () => ({
	fetching: false,
	fetched: true,
	error: null
});

export const errorRequest = error => ({
	error,
	fetching: false,
	fetched: false
});
