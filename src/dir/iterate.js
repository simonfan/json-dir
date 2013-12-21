'use strict';

var Q = require('q'),
	_ = require('lodash'),
	iterator = require('iterator');
/**
 * Return an iterator that will be capable of looping through files.
 *
 * @method
 */
exports.iterator = function (options) {

	options = options || {
		evaluator: this.readFiles.bind(this),
	};

	return this.read()
		.then(function (fnames) {
			return iterator(fnames, options);
		});
};

exports.iteratorSync = function (options) {
	options = options || {
		evaluator: this.readFilesSync.bind(this),
	};

	var it = iterator(this.readSync(), options);

	return it;
};
