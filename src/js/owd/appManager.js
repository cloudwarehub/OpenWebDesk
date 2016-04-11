define(['owd/registry', 'jquery', 'owd/container', 'owd/wm'], function(_registry, $, _container, _wm) {
	'use strict';
	
	/**
	 * handle container messages
	 */
	function signal(e) {
		switch (e.data[0]) {
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
	 * manage apps, such start, stop and kill, also used for monitor app status
	 */
	function appManager() {
		this.runningApps = [];
	}

	appManager.prototype = {
		/**
		 * run app
		 * 
		 * @param name
		 */
		run: function(name) {
			var app = _registry.findApp(name);
			// requirejs.config({baseUrl: app.url})
			// $.getScript(app.url+'/main.js');
			$.ajax({
				url: app.url + '/main.js',
				dataType: "text",
				success: function(script) {
					var container = _container.run(script)
					container.onmessage = signal;
					container.postMessage(['config', app]);
				}
			});
		},
		/**
		 * install app to owd
		 * 
		 * @param name
		 */
		install: function(url, cb) {
			$.getJSON(url + "/owdapp.json").fail(function() {
				alert('no such app: ' + url);
			}).done(function(appconfig) {
				_registry.register(url, appconfig);
				cb();
			});
		}
	}

	if (!window.appManager) {
		window.appManager = new appManager();
	}
	return window.appManager;
});
