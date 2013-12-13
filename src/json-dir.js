//     JsonDir
//     (c) simonfan
//     JsonDir is licensed under the MIT terms.

/**
 * CJS module.
 *
 * @module JsonDir
 */

'use strict';

	// native
var path = require('path');

	// thrid party
var json = require('json-file'),
	_ = require('lodash'),
	qify = require('q-ify'),
	Q = require('q');

	// wrap some fs module methods.
var qfs = qify('fs', ['readFile', 'readdir', 'writeFile']),

	// create a builder function that will instantiate
	// a json file.
	jsonFile = function jsonFile(fpath) {
		return new json.File(fpath);
	},

	// qify the jsonFile builder
	qJsonFile = qify(jsonFile, ['read', 'write']);

function normalizeFileName(str) {
	if (/\.json$/.test(str)) {
		return str;
	} else {
		return str + '.json';
	}
}

function normalizeFileId(str) {
	return str.replace(/\.json$/, '');
}

/**
 *
 */
exports.read = function (dirpath, fnames, callback) {

	var dir = new exports.Dir(dirpath);

	return dir.read(fnames, callback);
};

exports.readSync = function (dirpath) {

};


/**
 * @class Dir
 */
var Dir = exports.Dir = function Dir(dirpath, options) {

	this.path = dirpath;

	this._files = {};
	this.data = {};


	options = options || {};

	_.defaults(options, {
		replacer: null,
		space: '\t',
	});

	this.options = options;
};

/**
 *
 */
Dir.prototype.file = function file(fname) {
	// normalize file name
	fname = normalizeFileName(fname);

	// get path
	var fpath = path.join(this.path, fname);

	// return object
	return qJsonFile(fpath);
};

/**
 * READERS
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
Dir.prototype.read = function read() {
	// use qfs.readdir, as it is promisified.
	return qfs.readdir(this.path);
};

/**
 * File name reader.
 * fs.readdirSync
 *
 * @method readSync
 */
Dir.prototype.readSync = function readSync() {
	return qfs.readdirSync(this.path);
};

/**
 * Reads a file and returns a
 * promise for a qified json-file object.
 *
 *
 *
 */
Dir.prototype.readFiles = function readFiles(fnames) {

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


Dir.prototype._readFile = function _readFile(fname) {
	// build qJson file object.
	var qJson = this.file(fname);

	return qJson.read()
		.then(function () {
			return qJson;
		});
		// intentionally leave error unhandled.
};

Dir.prototype._readFiles = function _readFiles(fnames) {
	// fnames is required here
	var readFiles = Q.all(_.map(fnames, this._readFile.bind(this)));

	return readFiles.then(function (files) {
		var res = {},
			fids = _.map(fnames, normalizeFileId);

		// map files to their names.
		_.each(fids, function (fid, index) {
			res[fid] = files[index];
		});

		return res;
	});
};

Dir.prototype._readFileSync = function _readFileSync(fname) {
	var fpath = path.join(this.path, normalizeFileName(fname)),
		qJson = qJsonFile(fpath);

	qJson.readSync();

	return qJson;
};

Dir.prototype.readFilesSync = function readFilesSync(fnames) {

	fnames = fnames || this.readSync();

	return _.isString(fnames) ? this._readFileSync(fnames) : _.map(fnames, this._readFileSync.bind(this));
};

/**
 * WRITERS
 */

/**
 * Creates the dir and writes all loaded files to disk.
 */
Dir.prototype.write = function write() {

};

Dir.prototype.writeFiles = function writeFiles(first, second) {
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
Dir.prototype._writeFile = function _writeFile(fname, data) {
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

Dir.prototype._writeFiles = function _writeFiles(files) {
	// multiple files
	var keys = _(files).keys(),
		// get file ids
		fids = keys.map(function (fname) {
			return normalizeFileId(fname);
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



/**
 * UNLINKERS
 */
Dir.prototype.unlinkFiles = function unlinkFiles(fnames) {

};



/*

Dir.prototype.create = function create(dirname) {

};

Dir.prototype.createFile = function createFile(fname, data, options, callback) {
	var fpath = path.join(this.path, fname);

	qfs.writeFile(fpath, fname, options, function (err) {
		if (err) {
			callback(err);
		} else {
			this.file(fpath, callback);
		}
	});
};

Dir.prototype.createFileSync = function createFileSync(fname, data, options) {
	var fpath = path.join(this.path, fname);

	qfs.writeFileSync(fpath, data, options);

	return this.fileSync(fpath);
};

*/
