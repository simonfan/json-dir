'use strict';

/**
 * @module json-dir
 */

/**
 * @class helpers
 * @static
 */

/**
 * Takes a string and returns a '*.json' file name.
 * If the string already has a '.json' extension,
 * do nothing.
 *
 * @method normalizeFileName
 * @param str {String}
 */
exports.normalizeFileName = function normalizeFileName(str) {
	if (/\.json$/.test(str)) {
		return str;
	} else {
		return str + '.json';
	}
};

/**
 * Takes a string and trims out the trailing
 * '.json' (if present).
 *
 * @method normalizeFileId
 * @param str {String}
 */
exports.normalizeFileId = function normalizeFileId(str) {
	return str.replace(/\.json$/, '');
};
