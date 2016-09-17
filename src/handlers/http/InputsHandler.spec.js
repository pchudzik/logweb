'use strict';

import express from 'express';
import _ from 'lodash';

import td from 'testdouble';
import proxyquire from 'proxyquire';
import request from 'supertest';

describe('InputsHandler.spec.js', () => {
	const configurationMock = {
		'@noCallThru': true,
		getInputs: td.function()
	};

	let app;

	before(() => {
		const InputsHandler = proxyquire(
			'./InputsHandler',
			{'../../configuration': configurationMock}
		).default;
		const inputsHandler = new InputsHandler();
		app = express();
		inputsHandler.setup(app);
	});

	beforeEach(td.reset);

	it('should list all inputs', (done) => {
		//given
		configurationMock.getInputs = _.constant([
			{name: 'first input', otherProperty: 'value'},
			{name: 'second input', otherProperty: 'value'},
		]);

		//when
		request(app).get('/api/inputs')

		//then
			.expect('Content-Type', /json/)
			.expect(200, [
				{name: 'first input'},
				{name: 'second input'}
			])
			.end(done);
	});
});
