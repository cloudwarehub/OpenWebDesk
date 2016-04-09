define(function() {
	'use strict';
	function Registry() {
		this.apps = [];
	}

	Registry.prototype = {
		register: function(url, appconfig) {
			this.apps.push({
				url: url,
				config: appconfig
			});
		},
		findApp: function(name) {console.log(this.apps)
			var result = null;
			for (var i in this.apps) {
				if (this.apps[i].config.name == name) {
					result = this.apps[i];
					break;
				}
			}
			return result;
		}
	}

	if (!window.registry) {
		window.registry = new Registry();
	}
	return window.registry;
});