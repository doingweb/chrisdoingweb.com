module.exports = function(grunt) {
	"use strict";

	grunt.registerTask('build', function (environment) {
		grunt.task.run('compass:' + (environment || 'production'));
		grunt.task.run('jekyll:build');
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
				files: ['**/*.html', 'css/**', '**/*.js', '!_site/**', '!sass/**', '!Gruntfile.*', '!node_modules/**'],
				tasks: 'jekyll:build',
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
};
