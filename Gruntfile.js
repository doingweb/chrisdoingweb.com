'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);

	grunt.initConfig({

    paths: {
      src: 'src',
      dist: 'dist',
      tmp: '.tmp',
      assets: '<%= paths.dist %>/assets',
      content: '<%= paths.src %>/content',
      data: '<%= paths.src %>/data',
      templates: '<%= paths.src %>/templates',
      bower: 'bower_components'
    },

		credentials: grunt.file.readJSON('credentials.json'),

    watch: {
      assemble: {
        files: ['<%= paths.src %>/{content,data,templates}/**/*.{md,hbs,yml}'],
        tasks: ['assemble']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= paths.dist %>/**/*.html',
          '<%= paths.assets %>/{,*/}*.css',
          '<%= paths.assets %>/{,*/}*.js',
          '<%= paths.assets %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
      options: {
        layoutdir: '<%= paths.templates %>/layouts',
        layout: 'site.hbs',
        partials: '<%= paths.templates %>/partials/*.hbs',
        assets: '<%= paths.assets %>',
        data: '<%= paths.data %>/*.{json,yml}',
        helpers: ['<%= paths.templates %>/helpers/*.js', 'helper-moment'],
        marked: {
          gfm: true
        },
        plugins: ['assemble-contrib-sitemap', 'assemble-contrib-permalinks'],
        sitemap: {
          dest: '<%= paths.dist %>/'
        },
        permalinks: {
          preset: 'pretty'
        }
      },
      articles: {
        options: {
          layout: 'article.hbs'
        },
        files: [{
          expand: true,
          cwd: '<%= paths.content %>/articles/',
          src: '**/*.{md,hbs}',
          dest: '<%= paths.dist %>/articles/'
        }]
      },
      root: {
        files: [{
          expand: true,
          cwd: '<%= paths.content %>/',
          src: '*.hbs',
          dest: '<%= paths.dist %>/'
        }]
      }
    },

    imagemin: {
      images: {
        files: [{
          expand: true,
          cwd: '<%= paths.content %>/images/',
          src: '**/*.{png,jpg,gif}',
          dest: '<%= paths.assets %>/images/'
        }]
      }
    },

		modernizr: {
      dist: {
        devFile: '<%= paths.bower %>/modernizr/modernizr.js',
        outputFile: '<%= paths.assets %>/js/modernizr.js'
      }
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
    'assemble',
    'modernizr',
    'imagemin'
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
