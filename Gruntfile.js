(function(_build) {

	module.exports = function(grunt) {

		// Project configuration.
		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			jshint: {
				options: {
					jshintrc: true
				},
				all: ['Gruntfile.js', 'src/**/*.js'],
				core: ['src/core/**/*.js'],
			},
			uglify: {
				build: {
					src: 'tmp/all.js',
					dest: 'build/all.min.js'
				}
			},
			clean: ['build', 'tmp'],
			copy: {
				index: {
					src: 'src/index.html',
					dest: 'build/index.html'
				},
				res: {
					files: [{
						expand: true,
						cwd: 'src/res',
						src: '**',
						dest: 'build/res/',
						filter: 'isFile'
					}]
				},
				worker: {
					src: 'src/worker.js',
					dest: 'build/worker.js'
				},
				owdjs: {
					src: 'src/owdAppLoader.js',
					dest: 'build/owdAppLoader.js'
				},
				owdappjs: {
					src: 'src/js/owdapp.js',
					dest: 'build/owdapp.js'
				}
			},
			requirejs: {
				compile: {
					options: {
						baseUrl: "src",
						mainConfigFile: "src/config.js",
						name: 'core/owd',
						out: "build/owd.min.js",
						include: ['../bower_components/requirejs/require.js']
					}
				}
			},
			concat: {
				options: {
					separator: ';',
				},
				dist: {
					src: ['bower_components/requirejs/require.js', 'tmp/owd.min.js'],
					dest: 'tmp/all.js',
				},
			},
			watch: {
				theme: {
					files: ['src/themes/**'],
					tasks: ['theme']
				},
				index: {
					files: ['src/index.html'],
					tasks: ['copy:index']
				},
				core: {
					files: ['src/core/**'],
					tasks: ['jshint:core', 'requirejs']
				}
			},
		});

		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-contrib-requirejs');
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-contrib-watch');

		grunt.registerTask('theme', 'build themes', function() {
			_build.buildThemes();
		});

		// Default task(s).
		grunt.registerTask('default', ['clean', 'requirejs', 'copy', 'theme']);

	};
})(require('./build.js'));
