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
				}
			},
			requirejs: {
				compile: {
					options: {
						baseUrl: "src/js",
						mainConfigFile: "src/js/config.js",
						name: 'owd',
						out: "tmp/owd.min.js"
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
			}
		});

		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-contrib-requirejs');
		grunt.loadNpmTasks('grunt-contrib-concat');

		grunt.registerTask('theme', 'build themes', function() {
			_build.buildThemes();
		});

		// Default task(s).
		grunt.registerTask('default', ['clean', 'requirejs', 'copy', 'theme', 'concat', 'uglify']);

	};
})(require('./build.js'));
