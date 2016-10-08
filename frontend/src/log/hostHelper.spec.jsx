import {expect} from "chai";
import {resolvePort} from "./hostHelper";

describe("hostHelper.spec.jsx", () => {
	[
		{host: "http://example.com", port: "", expectedPort: 80},
		{host: "https://example.com", port: "", expectedPort: 443},
		{host: "http://example.com:123", port: "123", expectedPort: 123}
	].forEach(location => {
		it("should resolve host without protocol", () => {
			// given
			const windowMock = {location};

			// expect
			expect(resolvePort(windowMock)).to.eql(location.expectedPort);
		});
	});
});
