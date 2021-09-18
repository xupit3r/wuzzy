const gulp = require('gulp');
const mocha = require('gulp-mocha');

/**
 * Runs our mocha tests.
 * 
 * @param {Function} done completion callback
 */
function testMe (done) {
	gulp.src('tests/*.js', { read: false })
		  .pipe(mocha({ reporter: 'spec' }))
      .once('error', done)
      .once('finish', done);
}

exports.default = testMe;