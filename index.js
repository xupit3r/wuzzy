

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
 * @param  {Array} arrs - an array of two or more arrays to compute the union of 
 * @return {Array}   an array representing the intersection of the input arrays
 */
function intersection(arrs) {
	var p = {};
	var r = [];
	var ai = 0;

	arrs.forEach(function (arr) {
		arr.forEach(function (e) {
			if (!p[e]) {
				p[e] = {
					v: e,
					c: []
				};
			} else {
				p[e].c[ai] = 1;
			}
		});
		ai++;
	});

	Object.keys(p).forEach(function (k) {
		if (p[k].c.length === arrs.length) {
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
}

/**
 * Calculates the tanimoto distance (weighted jaccard index).
 * 
 * @param  {Array} a - the first array to compare
 * @param  {Array} b - the second array to compare
 * @return {Number}   returns the tanimoto distance for 
 * the two provided arrays.
 */
exports.tanimoto = function (a, b) {
	var both = intersection([a, b]).length;
	return  (both / (a.length + b.length - both));
}