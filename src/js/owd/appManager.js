define(['owd/registry', 'jquery', 'owd/container', 'owd/wm', 'owd/helper', 'owd/process', 'owd/app', 'owd/ui'], 
		function(_registry, $, _container, _wm, _helper, _process, _app, _ui) {
	var apps = [];

	/**
	 * install app
	 */
	function install(url, cb) {
		$.getJSON(_helper.join(url, "owdapp.json")).fail(function() {
			alert('no such app: ' + url);
		}).done(function(appconfig) {
			var uuid = _helper.uuid();
			var app = _app.create({id: uuid, url: url, config: appconfig});
			_registry.installApp(app);
			_ui.addIcon(app);
			cb(app);
		});
	}

	/**
	 * run app
	 */
	function run(app) {
		app.run();
	}
	
	return {
		install: install,
		run: run
	}
});
