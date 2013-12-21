'use strict';

/**
 * WRITERS
 */

var path = require('path');

var _ = require('lodash'),
	Q = require('q');

var helpers = require('./helpers');

/**
 * 
 * @method writeFiles
 */
exports.writeFiles = function writeFiles(first, second) {
	if (_.isObject(first)) {

		return this._writeFiles.apply(this, arguments);

	} else if (_.isString(first) && _.isObject(second)) {
		// single file
		return this._writeFile.apply(this, arguments);
	}
};

/**
 * Writes a single file.
 */
exports._writeFile = function _writeFile(fname, data) {
	var qJson = this.file(fname);

	// set data
	qJson.data = data;

	return qJson.write({ space: '\t', replacer: null })
		.then(function () {
			return qJson;
		}, function (err) {
			console.log(arguments);
		});
};

exports._writeFiles = function _writeFiles(files) {
	// multiple files
	var keys = _(files).keys(),
		// get file ids
		fids = keys.map(function (fname) {
			return helpers.normalizeFileId(fname);
		}).value();

	var writes = [];

	_.each(files, function (data, name) {
		// create a write
		writes.push(this._writeFile.bind(this)(name, data));

	}.bind(this));

	return Q.all(writes).then(function (files) {
		var res = {};

		_.each(fids, function (fid, index) {
			res[fid] = files[index];
		});

		return res;
	});
};
