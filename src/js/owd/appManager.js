define(['owd/registry', 'jquery', 'owd/app'], function(_registry, $) {
	'use strict';

	/**
	 * manage apps, such start, stop and kill, also used for monitor app status
	 */
	function appManager() {
		this.runningApps = [];
	}

	appManager.prototype = {
		/**
		 * run app
		 * @param name
		 */
		run: function(name) {
			alert('run' + name);
			var app = _registry.findApp(name);
			$.getScript(app.url+'/main.js');
		},
		/**
		 * install app to owd
		 * 
		 * @param name
		 */
		install: function(url, cb) {
			$.getJSON(url + "/owdapp.json").fail(function() {
				alert('no such app: '+url);
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