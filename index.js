

/**
 * Computes the union of two or more arrays.
 * 
 * @param  {Array} arrs - an array of two or more arrays to compute the union of 
 * @return {Array}   an array representing the union of the input arrays
 */
function union (arrs) {
	var r = {};
	[].concat.apply([], arrs).forEach(function (e) {
		r[e] = e;
	});
	return Object.keys(r).map(function (e) {
		return r[e];
	});
}

/**
 * Computes the intersection of two or more arrays.
 * 
 * @param  {[type]} arrs [description]
 * @return {[type]}      [description]
 */
function intersection(arrs) {
	var p = {};
	var r = [];

	arrs.forEach(function (arr) {
		arr.forEach(function (e) {
			p[e] = {
				v: e,
				c: (p[e] ? (p[e].c + 1) : 1)
			};
		});
	});

	Object.keys(p).forEach(function (k) {
		if (p[k].c === arrs.length) {
			r.push(p[k].v);
		}
	});

	return r;
}

/**
 * Calculates the jaccard index for the two 
 * provided arrays.
 * 
 * @param  {Array} a - the first array to compare
 * @param  {Array} b - the second array to compare
 * @return {Number}   returns the jaccard index for 
 * the two provided arrays.
 */
exports.jaccard = function (a, b) {
	return (intersection([a, b]).length / union([a, b]).length);
};