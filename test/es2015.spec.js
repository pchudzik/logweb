'use strict';

import {expect} from 'chai';
import sum from '../src/es2015';

// const expect = chai.expect;
describe('es2015.spec.js', function() {
	it('should sum two number', function() {
		expect(sum(2,2)).to.eql(4);
	});
});
