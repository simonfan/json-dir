'use strict';

/**
 * @module json-dir
 * @submodule dir
 */

var path = require('path');

var _ = require('lodash'),
	subject = require('subject');

/**
 * dir is the directory object representation.
 * The constructor basically stores the path to the dir
 * and creates a files hash, on which file objects will be stored.
 *
 * @class dir
 * @constructor
 * @param dirpath {String}
 * @param [options] {Object}
 *     - replacer -> null
 *     - space    -> '\t'
 */
var dir = module.exports = subject({
	initialize: function initializeDir(dirpath, options) {
		this.path = dirpath;

		this._files = {};
		this.data = {};


		options = options || {};

		_.defaults(options, {
			replacer: null,
			space: '\t',
		});

		this.options = options;
	},
});

// OBJECT
dir.proto(require('./file/object'));

// READ
dir.proto(require('./file/read'));

// WRITE
dir.proto(require('./file/write'));

// UNLINK
dir.proto(require('./file/unlink'));

// ITERATOR
dir.proto(require('./iterator'));
