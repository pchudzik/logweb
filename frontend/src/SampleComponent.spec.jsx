import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import SampleComponent from './SampleComponent';

describe('SampleComponent.spec.jsx', function() {
	it("shallow test", function() {
		expect(shallow(<SampleComponent />).find('h1')).to.have.text('Hello World!');
	});

	it("mount test", function() {
		//given
		const message = 'any message';

		//expect
		expect(mount(<SampleComponent msg='any message'/>).find('#message')).to.contain.text(`"${message}"`);
	});
});
