define(function() {
	'use strict';
	
	var store = {};
	
	function register(key, value) {
		store[key] = value;
	}
	
	function get(key) {
		return store[key];
	}
	
	function installApp(app) {
		var apps = get('apps');
		apps.push(app);
		register('apps', apps);
	}
	
	function findApp(id) {
		var apps = get('apps');
		for(var i in apps) {
			if (apps[i].getId() == id) {
				return apps[i]
			}
		}
		return null;
	}
	
	return {
		/**
		 * init registered app with empty array
		 */
		init: function() {
			register('apps', []);
		},
		register: register,
		get: get,
		installApp: installApp
	}
});