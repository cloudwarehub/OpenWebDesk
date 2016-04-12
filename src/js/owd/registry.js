define(function() {
	'use strict';
	function Registry() {
		this.apps = [];
	}

	Registry.prototype = {
		register: function(name, url, appconfig) {
			this.apps[name] = {
				url: url,
				config: appconfig
			};
		},
		findApp: function(name) {
			return this.apps[name];
		}
	}

	if (!window.registry) {
		window.registry = new Registry();
	}
	return window.registry;
});