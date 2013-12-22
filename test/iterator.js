'use strict';

var path = require('path');

var should = require('should');
var Q = require('q');

var jsonDir = require('../src/index');

beforeEach(function () {
	this.dir = jsonDir(path.join(__dirname, 'temp'));
});

describe('it = dir.iterator()', function () {

	it('should return a promise for an iterator object', function (done) {
		var getIterator = this.dir.iterator();

		Q.isPromise(getIterator).should.be.true;

		getIterator.then(function (iterator) {
			iterator.should.be.type('object');

			iterator.next.should.be.type('function');

			done();
		});
	});


	describe('iterator methods', function () {

		beforeEach(function (done) {

			// retrieve the iterator and then save reference to it.
			this.dir.iterator()
				.then(function (iterator) {
					this.iterator = iterator;

					done();
				}.bind(this));
		})


		describe('it.next()', function () {


			it('should return a promise for the next file', function (done) {
				var iterator = this.iterator;

				var readFile = iterator.next();

				// readFile is a promise object.
				Q.isPromise(readFile).should.be.true;

				// the promise is for a file object.
				readFile.done(function (file) {
					file.get('id').should.eql(1);

					done();
				});
			})

		});
	})
});



describe('it.iteratorSync(options {Object})', function () {
	it('is synchronous', function () {

		var iterator = this.dir.iteratorSync();


		var file = iterator.next();

		file.get('id').should.eql(1);

		iterator.next().get('id').should.eql(2);
		iterator.next().get('id').should.eql(3);
	});
});
