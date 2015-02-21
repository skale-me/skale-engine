#!/usr/local/bin/node --harmony

var co = require('co');
var ugrid = require('../../lib/ugrid-context.js')();

co(function *() {
	yield ugrid.init();

	var key = 1;
	var value = 2;
	var v = [[key, value], [3, 4], [5, 6]];

	function dup (e) {
		return [e, e];
	}

	var data = ugrid.parallelize(v).flatMap(dup).persist();
	yield data.lookup(key);

	v.push([key, value]);
	var res = yield data.lookup(key);

	var res = res.sort();

	console.assert(res.length == 2);
	console.assert(res[0][0] == key);
	console.assert(res[0][1] == value);
	console.assert(res[1][0] == key);
	console.assert(res[1][1] == value);

	ugrid.end();
})();
