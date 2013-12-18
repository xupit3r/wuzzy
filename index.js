

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
 * Computes the jaro-winkler distance for two given arrays.
 *
 * NOTE: this implementation is based on the one found in the 
 * Lucene Java library.
 * 
 * @param  {Array} a - the first array to compare
 * @param  {Array} b - the second array to compare
 * @param  {Number} t - the threshold for adding 
 * the winkler bonus (defaults to 0.7)
 * @return {Number}   returns the jaro-winkler distance for 
 * the two provided arrays.
 */
exports.jarowinkler = function (a, b, t) {
	var max, min;
	if (a.length > b.length) {
		max = a;
		min = b;
	} else {
		max = b;
		min = a;
	}
	var threshold = t ? t : .7;
	var weight = .1;
	var range = Math.floor(Math.max((max.length / 2) - 1, 0));
	var mIdx = [];
	var mFlg = [];
	var mi, xi, xn, c1;
	var matches = 0;
	for (mi = 0; mi < min.length; mi++) {
		c1 = min[mi];
		for (xi = Math.max(mi - range, 0), xn = Math.min(mi + range + 1, max.length);
			 xi < xn;
			 xi++) {
			if (!mFlg[xi] && (c1 === max[xi])) {
				mIdx[mi] = xi;
				mFlg[xi] = true;
				matches++;
				break;
			}
		}
	}

	var ma = [];
	var mb = [];
	var i, si;
	var trans = 0;
	var prefix = 0;
	for (i = 0, si = 0; i < min.length; i++) {
		if (mIdx[i] > -1) {
			ma[si] = min[i];
			si++;
		}
	}
	for(i = 0, si = 0; i < max.length; i++) {
		if (mFlg[i]) {
			mb[si] = max[i];
			si++;
		}
	}
	for (mi = 0; mi < ma.length; mi++) {
		if (ma[mi] !== mb[mi]) {
			trans++;
		}
	}
	for (mi = 0; mi < min.length; mi++) {
		if (a[mi] === b[mi]) {
			prefix++;
		} else {
			break;
		}
	}

	/* actual jaro-winkler formula */
	var m = matches;
	var t = trans / 2;
	if (!m) {
		return 0;
	} else {
		var j = (m / a.length + m / b.length + (m - t) / m) / 3
		var jw = (j < threshold 
			? j 
			: (j + Math.min(weight, 1 / max.length) * prefix * (1 - j)));
		return jw;
	}

}

/**
 * Calculates the levenshtein distance for the 
 * two provided arrays and returns the normalized 
 * distance.
 * 
 * @param  {Array} a - the first array to compare
 * @param  {Array} b - the second array to compare
 * @param  {Object} w - (optional) a set of key/value pairs 
 * definining weights for the deletion (key: d), insertion 
 * (key: i), and substitution (key: s). default values are 
 * 1 for all operations.
 * @return {Number}   returns the jaccard index for 
 * the two provided arrays.
 */
exports.levenshtein = function (a, b, w) {
	if (a.length === 0) {
		return b.length;
	} 
	if (b.length === 0) {
		return a.length;
	}

	var weights = (w ? w : {
		d: 1,
		i: 1,
		s: 1
	});
	var v0 = [];
	var v1 = [];
	var vlen = b.length + 1;
	var i,j;
	var cost;
	var mlen;

	for (i = 0; i < vlen; i++) {
		v0[i] = i;
	}

	for (i = 0; i < a.length; i++) {
		v1[0] = i + 1;

		for (j = 0; j < b.length; j++) {
			cost = (a[i] === b[j]) ? 0 : weights.s;
			v1[j + 1] = Math.min(
				v1[j] + weights.d,
				v0[j + 1] + weights.i,
				v0[j] + cost
			);
		}

		for (j = 0; j < vlen; j++) {
			v0[j] = v1[j];
		}
	}

	mlen = Math.max(a.length, b.length);

	return (mlen - v1[b.length]) / mlen;
};

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