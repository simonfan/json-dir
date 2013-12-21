'use strict';

/**
 * @module json-dir
 * @submodule Dir
 */

var path = require('path');

var _ = require('lodash'),
	json = require('json-file'),
	qify = require('q-ify');

var qJsonFile = qify(function (fpath) {
	return new json.File(fpath);
}, ['read', 'write']);

var helpers = require('./helpers');

/**
 * Dir is the directory object representation.
 * The constructor basically stores the path to the dir
 * and creates a files hash, on which file objects will be stored.
 *
 * @class Dir
 * @constructor
 * @param dirpath {String}
 * @param [options] {Object}
 *     - replacer -> null
 *     - space    -> '\t'
 */
var Dir = module.exports = function Dir(dirpath, options) {

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
 * Instantiates a file object given a file name.
 *
 * @method file
 * @param fname {String}
 */
Dir.prototype.file = function file(fname) {
	// normalize file name
	fname = helpers.normalizeFileName(fname);

	// get path
	var fpath = path.join(this.path, fname);

	// return object
	return qJsonFile(fpath);
};


// READ
_.assign(Dir.prototype, require('./read'));

// WRITE
_.assign(Dir.prototype, require('./write'));

// UNLINK
_.assign(Dir.prototype, require('./unlink'));

// ITERATE
_.assign(Dir.prototype, require('./iterate'));
