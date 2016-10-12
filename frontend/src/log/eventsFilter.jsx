export default function eventsFilter(events, filter) {
	if (!filter.providers.length) {
		return events;
	}

	return events.filter(event => filter.providers.includes(event.providerName));
}
