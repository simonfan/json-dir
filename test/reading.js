'use strict';

var should = require('should');

var jsonDir = require('../src/json-dir');

var Q = require('q');

describe('jsonDir.read', function () {
	beforeEach(function (done) {
		done();
	});

	describe('jsonDir.read', function() {
		it('should return a promise when given only dir parameter', function () {
			var dirPromise = jsonDir.read('temp');

			should(Q.isPromise(dirPromise)).ok;
		});

		it('should return nothing and run the callback when given dir and callback parameters')
	});
});
