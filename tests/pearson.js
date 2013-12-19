/* Tests for the jaccard logic. */
var expect = require('chai').expect;
var wuzzy = require('../index');

describe('pearson tests', function () {
	it('should correctly calcuate the pearson correlation', function () {
		var tests = [
			{
				a: {a: 2.5, b: 1},
				b: {a: 2.5, b: 1},
				exp: 1
			}
		];
		tests.forEach(function (el) {
			expect(wuzzy.pearson(el.a, el.b)).to.equal(el.exp);
		});
	});
});