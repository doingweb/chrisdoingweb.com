'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);

	grunt.initConfig({

    paths: {
      src: 'src',
      dist: 'dist'
    },

		credentials: grunt.file.readJSON('credentials.json'),

    watch: {
      assemble: {
        files: ['<%= paths.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml}'],
        tasks: ['assemble']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= paths.dist %>/{,*/}*.html',
          '<%= paths.dist %>/assets/{,*/}*.css',
          '<%= paths.dist %>/assets/{,*/}*.js',
          '<%= paths.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      dist: {
        options: {
          open: true,
          base: [
            '<%= paths.dist %>'
          ]
        }
      }
    },

    assemble: {
      blag: {
        options: {
          flatten: true,
          layout: '<%= paths.src %>/templates/layouts/site.hbs',
          partials: '<%= paths.src %>/templates/partials/*.hbs',
          assets: '<%= paths.dist %>/assets',
          data: '<%= paths.src %>/data/*.{json,yml}',
          plugins: ['assemble-contrib-sitemap', 'assemble-contrib-permalinks'],
          permalinks: {
            preset: 'pretty'
          }
        },
        files: {
          '<%= paths.dist %>/': ['<%= paths.src %>/content/**/*.hbs']
        }
      }
    },

		modernizr: {
			devFile: 'bower_components/modernizr/modernizr.js',
			outputFile: 'src/js/modernizr.js'
		},

    clean: ['<%= paths.dist %>/**'],

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
						src: ['dist/**/*.html'],
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
				upload: grunt.file.expand({ cwd: 'build', filter: 'isFile' }, '**').map(function (file) {
					return {
						src: 'build/' + file,
						dest: file
					}
				})
			}
		}
	});

  grunt.loadNpmTasks('assemble');
	require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', [
    'clean',
		// 'modernizr',
    'assemble'
		// 'replace'
  ]);

  grunt.registerTask('server', [
    'build',
    'connect',
    'watch'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
