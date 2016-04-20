(function(_path, _fs, _less) {
	var ROOT = __dirname;
	var SRC_ROOT = _path.join(ROOT, 'src');
	var THEME_ROOT = _path.join(ROOT, 'src/themes');
	var BUILD_ROOT = _path.join(ROOT, 'build');
	
	var getDirName = require('path').dirname;

	function writeFile(path, contents, cb) {
		console.log(getDirName(path))
		_fs.mkdirsSync(getDirName(path));
		_fs.writeFileSync(path, contents);
	}

	/* get dirs in dir, if withhidden is true, also return file bigin with "." */
	function getDirectories(dir, withhidden) {
		var wh = withhidden || false;
		var list = [];
		_fs.readdirSync(dir).forEach(function(iter) {
			var s = _fs.lstatSync(_path.join(dir, iter));
			if (s.isDirectory() || s.isSymbolicLink()) {
				if (!wh && iter.match(/^\./)) {
					return;
				}
				list.push(iter);
			}

		});
		return list;
	}

	function buildThemes() {
		var themes = getDirectories(THEME_ROOT);
		themes.forEach(function(theme){
			var less_content = _fs.readFileSync(_path.join(THEME_ROOT, theme, 'style.less')).toString();
			_less.render(less_content, {compress: true, syncImport: true, paths: _path.join(THEME_ROOT, theme)}, function(e, output) {
				if (e) {
					console.log(e);
					return;
				}
				writeFile('build/themes/default/style.css', output.css);
			});
			
			/* copy fonts */
			_fs.copySync(_path.join(THEME_ROOT, theme, 'font'), _path.join('build/themes/', theme, '/font'));
		})
	}
	module.exports = {
		buildThemes: buildThemes,
	};
})(require('path'), require('node-fs-extra'), require('less'));