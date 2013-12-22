

'use strict';

/**
 * @module json-dir
 */

// native:
var path = require('path');

// third party:
var qify = require('q-ify'),
	_ = require('lodash'),
	json = require('json-file');

// qified jsonfile
var qJsonFile = qify(function (fpath) {
	return new json.File(fpath);
}, ['read', 'write']);


var helpers = require('../helpers');

/**
 * Instantiates a file object given a file name.
 *
 * @method file
 * @param fname {String}
 */
exports.file = function file(fname) {
	// normalize file name
	fname = helpers.normalizeFileName(fname);

	// get path
	var fpath = path.join(this.path, fname);

	// return object
	return qJsonFile(fpath);
};
