var mocha = require('mocha');

module.exports = function(grunt) {

	/* add the grunt-mocha-test task */
	grunt.loadNpmTasks('grunt-mocha-test');

	/* grunt configuration */
	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['tests/*.js']
			}
		}
	});

	/* register the test task */
	grunt.registerTask('test', 'mochaTest');
};