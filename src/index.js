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

/**
 * Instantiates a jsondir.Dir object,
 * invokes readFiles(fnames) and returns the promise.
 *
 * @method load
 * @param dirpath {String}
 * @param fnames {String|Array}
 */
exports.load = function (dirpath, fnames) {

	var dir = new exports.Dir(dirpath);

	return dir.readFiles(fnames);
};

/**
 * Instantiates a jsondir.Dir object,
 * invokes readFilesSync(fnames) and returns the
 * object itself.
 *
 * @method loadSync
 * @param dirpath {String}
 * @param fnames {String|Array}
 */
exports.loadSync = function (dirpath, fnames) {

	var dir = new exports.Dir(dirpath);

	dir.readFilesSync(fnames);

	return dir;
};


/**
 * The Dir class.
 */
exports.Dir = require('./dir');
