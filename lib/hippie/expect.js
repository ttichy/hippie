/**
 * External dependencies.
 */

var pathval = require('pathval');

/**
 * Internal dependencies.
 */

var assert = require('./assert');

/**
 * Return a status code expectation.
 *
 * @param {Number} expected status code
 * @returns {Function}
 * @api public
 */

exports.statusCode = function(code) {
  return function statusCode(res, body, next) {
    next(assert(res.statusCode, code, 'Status code'));
  };
};


exports.expectJSON = function(path,expectedJSON) {
	var equal=true;
	var missed='';
	return function expectJSON(res, body, next) {
	
		if (typeof expectedJSON !== 'object' && (typeof expectedJSON !== 'function' || expectedJSON === null)) {
			next(assert(expectedJSON,'Object', 'ExpectJSON parameter was not an object'));
			return;
		}	
	
		Object.keys(expectedJSON).forEach(function (key) {
			if(expectedJSON[key] != pathval(path,body)[key])
			{
				equal=false;
				missed=key;
				return;
			}
		})
		next(assert(equal,true,missed + ' was not as expected'));
	};
}



/**
 * Return a header expectation.
 *
 * @param {String} header
 * @param {String} value
 * @returns {Function}
 * @api public
 */

exports.header = function(key, val) {
  key = key.toLowerCase();
  return function header(res, body, next) {
    next(assert(res.headers[key], val, 'Header - ' + key));
  };
};

/**
 * Return a value expectation.
 *
 * @param {String} string path
 * @param {Mixed} value
 * @returns {Function}
 * @api public
 */

exports.value = function(key, val) {
  return function value(res, body, next) {
    next(assert(pathval(key, body), val, 'Value - ' + key));
  };
};

/**
 * Return a body expectation.
 *
 * @param {Mixed} expected
 * @returns {Function}
 * @api public
 */

exports.body = function(expected) {
  return function value(res, body, next) {
    var actual = res.body;

    if (Array.isArray(expected)) {
      actual = body;
    } else if (Object(expected) === expected && !isRegexp(expected)) {
      actual = body;
    }

    next(assert(actual, expected, 'Body'));
  };
};

function isRegexp(input) {
  return toString.call(input) === '[object RegExp]';
}

exports.json = function(jsonTest) {
  return function json(res, body, next) {
	var actual = res.body;
	var jsonResponse =JSON.parse(actual);
	
    next(assertContains(jsonResponse, jsonTest, 'Status code'));
  };
};
