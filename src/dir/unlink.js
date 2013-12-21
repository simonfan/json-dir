'use strict';

/**
 * UNLINKERS
 */
var path = require('path');

var qify = require('q-ify'),
	_ = require('lodash'),
	Q = require('q');

var helpers = require('./helpers'),
	qfs = qify('fs', ['unlink']);

/**
 * Returns a promise.
 * 
 * @method unlinkFiles
 * @param fnames {String|Array}
 */
exports.unlinkFiles = function unlinkFiles(fnames) {
	fnames = _.isArray(fnames) ? fnames : [fnames];

	var unlink = _.map(fnames, function (f) {

		var fname = helpers.normalizeFileName(f),
			fpath = path.join(this.path, fname);

		return qfs.unlink(fpath);
	}.bind(this));

	return Q.all(unlink);
};

exports.unlinkFilesSync = function unlinkFilesSync(fnames) {
	fnames = _.isArray(fnames) ? fnames : [fnames];

	_.each(fnames, function (f) {
		var fname = helpers.normalizeFileName(f),
			fpath = path.join(this.path, fname);

		qfs.unlinkSync(fpath);
	}.bind(this));

	return this;
};

