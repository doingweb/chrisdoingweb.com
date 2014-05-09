module.exports = function(grunt) {
	"use strict";

	// TODO: Fix this up!

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		credentials: grunt.file.readJSON('credentials.json'),
		modernizr: {
			devFile: 'contents/js/modernizr.js',
			outputFile: 'contents/js/modernizr.js'
		},
		replace: {
			analytics: {
				options: {
					patterns: [
						{
							match: 'googleAnalyticsTrackingID',
							replacement: '<%= credentials.google.analytics.id %>'
						}
					]
				},
				files: [
					{
						src: ['build/**/*.html'],
						dest: './'
					}
				]
			}
		},
		s3: {
			options: {
				bucket: '<%= credentials.aws.bucket %>',
				key: '<%= credentials.aws.key %>',
				secret: '<%= credentials.aws.secret %>',
				region: '<%= credentials.aws.region %>',
				gzip: true,
				access: 'public-read'
			},
			deploy: {
				upload: grunt.file.expand({ cwd: '_site', filter: 'isFile' }, '**').map(function (file) {
					return {
						src: 'build/' + file,
						dest: file
					}
				})
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('build', function (environment) {
		grunt.task.run([
			'modernizr',
			'replace'
		]);
	});
};
