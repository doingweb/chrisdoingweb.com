module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		credentials: grunt.file.readJSON('credentials.json'),
		compass: {
			options: {
				sassDir: 'sass',
				cssDir: 'css',
				require: 'zurb-foundation'
			},
			development: {
				options: {
					outputStyle: 'expanded'
				}
			},
			production: {
				options: {
					outputStyle: 'compressed'
				}
			}
		},
		modernizr: {
			devFile: 'js/modernizr.js', // If we want a real dev version, we'll need to have two build stages (grunt and jekyll)
			outputFile: 'js/modernizr.js'
		},
		jekyll: {
			build: {}
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
						src: ['_site/**/*.html'],
						dest: './'
					}
				]
			}
		},
		watch: {
			options: {
				atBegin: true
			},
			css: {
				files: 'sass/**',
				tasks: 'compass:development'
			},
			jekyll: {
				files: ['**/*.html', 'css/**', '**/*.js', '!_site/**', '!sass/**', '!Gruntfile.*', '!node_modules/**', '!README*'],
				tasks: 'jekyll:build',
				options: {
					livereload: true
				}
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
						src: '_site/' + file,
						dest: file
					}
				})
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('build', function (environment) {
		grunt.task.run([
			'compass:' + (environment || 'production'),
			'modernizr',
			'jekyll:build',
			'replace'
		]);
	});
};
