module.exports = function(grunt) {
	"use strict";

	grunt.registerTask('build', function (environment) {
		grunt.task.run('compass:' + (environment || 'production'));
		grunt.task.run('modernizr');
		grunt.task.run('jekyll:build');
	});

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
		jekyll: {
			build: {}
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
		modernizr: {
			devFile: 'js/modernizr.js', // If we want a real dev version, we'll need to have two build stages (grunt and jekyll)
			outputFile: 'js/modernizr.js'
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

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-modernizr');
	grunt.loadNpmTasks('grunt-s3');
};
