define(['owd/registry', 'jquery', 'owd/container', 'owd/wm', 'owd/helper', 'owd/process', 'owd/app', 'owd/ui'], 
		function(_registry, $, _container, _wm, _helper, _process, _app, _ui) {
	var apps = [];
	/**
	 * handle container messages
	 */
	function signal(e) {
		switch (e.data[0]) {
		case 'createApp':
			apps.push(e.data[1]);
			break;
		case 'createWindow':
			_wm.createWindow(e.data[1]);
			break;
		case 'showWindow':
			_wm.showWindow(e.data[1]);
			break;
		case 'createShowWindow':
			var win = _wm.createWindow(e.data[1]);
			_wm.showWindow({wid: win.getWid()});
			break;
		case 'hideWindow':
			_wm.hideWindow(e.data[1]);
			break;
		case 'destroyWindow':
			_wm.destroyWindow(e.data[1]);
			break;
		case 'windowFrame':
			var win = _wm.getWindow(e.data[1].wid);
			win.getPlayer().decode(new Uint8Array(e.data[1].nal));
			break;
		default:
			break;
		}
	}

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
