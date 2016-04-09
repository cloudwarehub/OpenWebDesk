(function(_build) {

	module.exports = function(grunt) {

		// Project configuration.
		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
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
				apps: {
					files: [{
						expand: true,
						cwd: 'src/apps',
					    src: '**',
						dest: 'build/apps/'
					}]
				}
			},
			requirejs: {
				compile: {
					options: {
						baseUrl: "src/js",
						mainConfigFile: "src/js/config.js",
						name: 'owd',
						out: "tmp/owd.min.js",
						stubModules: ['text', 'hbars']
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
				files: ['src/**'],
				tasks: ['default'],
				options: {
					livereload: true
				}
			},
		});

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
		grunt.registerTask('default', ['clean', 'requirejs', 'copy', 'theme', 'concat', 'uglify']);

	};
})(require('./build.js'));