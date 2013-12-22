'use strict';

var path = require('path'),
	fs = require('fs');

var should = require('should');
var Q = require('q');
var _ = require('lodash');

var jsonDir = require('../src/index');

describe('jsonDir', function () {

	beforeEach(function() {
		this.tempDir = path.join(__dirname, 'temp');
	})

	it('can be instantiated without blowing up.', function () {
		var dir = jsonDir(this.tempDir);

		dir.should.be.type('object');

		dir.path.should.eql(this.tempDir);
	});

	describe('dir.read()', function () {

		it('returns a promise', function () {

			var dir = jsonDir(this.tempDir),
				fnames = dir.read();

			should(Q.isPromise(fnames)).be.true;
		});

		it('that when resolved, returns the results of fs.readdir', function (done) {

			var dir = jsonDir(this.tempDir),
				fnames = dir.read();

			fnames.done(function(files) {
				files.should.eql(['data1.json', 'data2.json', 'data3.json']);

				done();
			});

		});

	});


	describe('dir.readFiles(fname {String})', function () {

		it('returns a promise for a qJsonFile object', function () {
			var dir = jsonDir(this.tempDir),
				fnames = dir.readSync();

			var file = dir.readFiles(fnames[0]);

			should(Q.isPromise(file)).be.true;
		});

		it('... that is resolved with a qJsonFile object', function (done) {
			var dir = jsonDir(this.tempDir);

			dir.readFiles('data1.json')
				.then(function (data1) {

					data1.get('id').should.eql('1');
					done();

				}, function (err) {

				})
				.done();
		});

	});

	describe('dir.readFiles(fnames {Array})', function () {
		it('returns a promise that is resolved with an array of file objects', function (done) {
			var dir = jsonDir(this.tempDir),
				fileIds = ['data1', 'data2'],
				fileNames = _.map(fileIds, function (fid) { return fid + '.json'; });

			dir.readFiles(fileNames)
				.then(function (files) {

					files.should.be.type('object');

					_.each(fileIds, function (fid) {

						should(files[fid]).be.type('object');

					});

					done();

				}).done();
		})
	});

	describe('dir.readFiles()', function () {
		it('returns a promise for all the files within the directory', function (done) {
			var dir = jsonDir(this.tempDir);

			dir.readFiles()
				.done(function (files) {

					_(files).keys().map(function (key) {
						return key + '.json';
					}).value()
						.should.eql(fs.readdirSync(this.tempDir));

					done();
				}.bind(this))
		});
	});

	describe('dir.writeFiles(data)', function () {
		it('returns a promise for a hash of file objects', function (done) {
			var dir = jsonDir(this.tempDir);

			var write = dir.writeFiles({
				file1: {
					name: 'file1',
				},
				file2: {
					name: 'file2'
				},
				file3: {
					name: 'file3'
				}
			});

			write.done(function (files) {
				_.size(files).should.eql(3);

				files.file1.get('name').should.eql('file1');
				files.file2.get('name').should.eql('file2');
				files.file3.get('name').should.eql('file3');


				done();
			});
		});

		afterEach(function () {
			var tempDir = this.tempDir;
			_.each(['file1', 'file2', 'file3'], function (f) {
				var p = path.join(tempDir, f + '.json');
				fs.unlinkSync(p);
			});
		})
	})

	describe('dir.writeFiles(fname, fdata)', function () {
		it('returns a promise for the file object after they\'ve been successfully written', function (done) {
			var dir = jsonDir(this.tempDir);

			var write = dir.writeFiles('writing-test', {
				name: 'writing-test'
			});

			write.done(function (qjson) {

				var data = JSON.parse(fs.readFileSync(path.join(dir.path, 'writing-test.json')));

				qjson.get('name').should.eql(data.name);

				done();
			}, function () {
				console.log(arguments);
				done();
			})
		});

		afterEach(function () {
			fs.unlinkSync(path.join(this.tempDir, 'writing-test.json'));
		})
	});


	describe('dir.unlinkFiles(fnames)', function () {
		beforeEach(function () {
			fs.writeFileSync(this.tempDir + '/unlink1.json');
			fs.writeFileSync(this.tempDir + '/unlink2.json');
		});

		it('effectivelly unlinks', function (done) {
			var dir = jsonDir(this.tempDir);

			dir.unlinkFiles(['unlink1', 'unlink2.json'])
				.done(function () {
					var files = fs.readdirSync(dir.path);

					files.length.should.eql(3);

					done();

				})
		});
	})
});
