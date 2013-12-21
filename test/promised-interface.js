'use strict';

var path = require('path');

var should = require('should');

var jsonDir = require('../src/index');

var lodash = require('lodash');

var Q = require('q');

describe('jsonDir promise based interface', function () {
	beforeEach(function (done) {
		done();
	});

	it('has promise-based methods', function () {
		var promiseToRead = jsonDir.load(path.join(__dirname, 'temp'));

		should(Q.isPromise(promiseToRead)).ok;
	});
});
