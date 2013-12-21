'use strict';

/**
 * @module json-dir
 */

var path = require('path');

var qify = require('q-ify'),
	_ = require('lodash'),
	Q = require('q');

var	qfs = qify('fs', ['readdir', 'readFile']);

var helpers = require('./helpers');


//////////////
// readddir //
//////////////
//

/**
 * @class dir-read
 */

/**
 * File name reader
 * fs.readdir(), but with promise interface.
 *
 * @method read
 * @param [fnames] {Array}
 *
 * @return promise
 */
exports.read = function read() {
	// use qfs.readdir, as it is promisified.
	return qfs.readdir(this.path);
};

/**
 * File name reader.
 * fs.readdirSync
 *
 * @method readSync
 */
exports.readSync = function readSync() {
	return qfs.readdirSync(this.path);
};




//////////////
// readFile //
//////////////
//

/**
 * Reads a file and returns a
 * promise for a qified json-file object.
 *
 * @method readFiles
 * @param fnames {String|Array}
 */
exports.readFiles = function readFiles(fnames) {

	if (_.isString(fnames)) {
		// single file
		return this._readFile(fnames);

	} else if (_.isArray(fnames)) {
		// array of files
		return this._readFiles(fnames);

	} else if (!fnames) {
		// all files
		var readFnames = this.read();

		return readFnames.then(function (fnames) {

			// return a promise.
			return this._readFiles(fnames);

		}.bind(this));
	}
};

/**
 * Alias for readFiles.
 * @method readFile
 */
exports.readFile = exports.readFiles;

/**
 * Returns a promise for a fully read file object.
 *
 * @method _readFile
 * @private
 * @param fname {String}
 */
exports._readFile = function _readFile(fname) {
	// build qJson file object.
	var qJson = this.file(fname);

	return qJson.read()
		.then(function () {
			return qJson;
		});
		// intentionally leave error unhandled.
};

/**
 * Returns an object keyed by fid (fname without .json)
 * and valued by file objects.
 *
 * @method _readFiles
 * @private
 * @param fnames {Array}
 */
exports._readFiles = function _readFiles(fnames) {
	// fnames is required here
	var readFiles = Q.all(_.map(fnames, this._readFile.bind(this)));

	return readFiles.then(function (files) {
		var res = {},
			fids = _.map(fnames, helpers.normalizeFileId);

		// map files to their names.
		_.each(fids, function (fid, index) {
			res[fid] = files[index];
		});

		return res;
	});
};



//////////////////
// readFileSync //
//////////////////
//

/**
 * Sync implementation of readFiles
 *
 * @method readFilesSync
 * @param fnames {String|Array}
 */
exports.readFilesSync = function readFilesSync(fnames) {

	fnames = fnames || this.readSync();

	return _.isString(fnames) ?
				this._readFileSync(fnames) :
				_.map(fnames, this._readFileSync.bind(this));
};

exports.readFileSync = exports.readFilesSync;

exports._readFileSync = function _readFileSync(fname) {
	var qJson = this.file(fname);

	qJson.readSync();

	return qJson;
};
